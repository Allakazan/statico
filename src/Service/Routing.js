import TemplateEngine from "./TemplateEngine.js";
import AssetManagement from "./AssetManagement/index.js";
import Markdown from "./Markdown.js";
import Server from "./Server.js";

let routes = [];
let postRoute = false;

const Routing = {};

Routing.route = (file, directory = '/') => {
    routes.push({file , directory})
}

Routing.usePost = (file, directory = '/') => {
    postRoute = {file , directory}
}

Routing.init = (action) => {
    switch (action) {
        case 'build':
            return Routing.build();
        case 'serve':
            return Routing.serve();
            break;
    }
}

Routing.getContent = async (file, params) => {
    return await TemplateEngine.renderPage(file, params)
}

Routing.build = async ({ serveMode = false } = {}) => {

    const markdownData = await Markdown.renderMarkdown()

    TemplateEngine.createDistFolder(serveMode);
    //TemplateEngine.copyAssets();
    AssetManagement.init(serveMode);

    for (const route of routes) {
        if (TemplateEngine.viewExists(route.file)) {
            const htmlContent = await Routing.getContent(route.file, markdownData)

            TemplateEngine.saveFile(route.file, route.directory, htmlContent)
        } else {
            console.log('Warning: View ' + route.file + " was not found.")
        }
    }

    if (postRoute) {

        for (const [key, data] of Object.entries(markdownData.posts)) {

            const htmlContent = await Routing.getContent(postRoute.file, {
                _pagePost: data,
            })

            TemplateEngine.saveFile(data.fileInfo.name, postRoute.directory, htmlContent)
        }
    }
}

Routing.serve = async () => {
    TemplateEngine.serveMode = true;
    await Routing.build()

    Server.startHTTPServer();
    Server.startWSServer();

    Server.listenForChanges(async (e, file) => {
        await Routing.build({ serveMode: true })

        let ext = file.split('.')[file.split('.').length - 1]
        let action = ext == 'css' ? 'refreshcss' : 'reload';

        for (const socket of Server.sockets) {
            
            socket.send(action);   
        }
    })
}

export default Routing;