const TemplateEngine = require('./TemplateEngine');
const Markdown = require('./Markdown');
const Server = require('./Server');

let routes = [];
let postRoute = false;

module.exports = {
    route(file, directory = '/') {
        routes.push({file , directory})
    },
    usePost(file, directory = '/') {
        postRoute = {file , directory}
    },
    init(action) {
        switch (action) {
            case 'build':
                return this.build();
            case 'serve':
                return this.serve();
                break;
        }
    },
    async getContent(file, params) {
        return await TemplateEngine.renderPage(file, params)
    },
    async build() {

        const markdownData = await Markdown.renderMarkdown()

        TemplateEngine.createDistFolder();
        TemplateEngine.copyAssets();

        for (const route of routes) {
            if (TemplateEngine.viewExists(route.file)) {
                const htmlContent = await this.getContent(route.file, {
                    _posts: markdownData.posts,
                    _projects: markdownData.projects
                })

                TemplateEngine.saveFile(route.file, route.directory, htmlContent)
            } else {
                console.log('Warning: View ' + route.file + " was not found.")
            }
        }

        if (postRoute) {

            for (const [key, data] of Object.entries(markdownData.posts)) {

                const htmlContent = await this.getContent(postRoute.file, {
                    _pagePost: data,
                })

                TemplateEngine.saveFile(data.fileInfo.name, postRoute.directory, htmlContent)
            }
        }
    },
    async serve() {
        TemplateEngine.serveMode = true;
        await this.build()

        Server.startHTTPServer();
        Server.startWSServer();

        Server.listenForChanges(async (e, file) => {
            await this.build()

            let ext = file.split('.')[file.split('.').length - 1]
            let action = ext == 'css' ? 'refreshcss' : 'reload';

            for (const socket of Server.sockets) {
                
                socket.send(action);   
            }
        })
    }
}