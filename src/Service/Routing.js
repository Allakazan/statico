const TemplateEngine = require('./TemplateEngine');
const Markdown = require('./Markdown');
const Server = require('./Server');

module.exports = class Routing {
    
    static routes = []
    
    static route(file, directory = '/') {
        this.routes.push({file , directory})
    }

    static init(action) {
        switch (action) {
            case 'build':
                return this.build();
            case 'serve':
                return this.serve();
                break;
        }
    }

    static async getContent(file) {
        const markdownContent = await Markdown.renderMarkdown()

        return await TemplateEngine.renderPage(file, {
            _posts: markdownContent.posts,
            _projects: markdownContent.projects
        })
    }

    static async build() {
        
        TemplateEngine.createDistFolder();
        TemplateEngine.copyAssets();

        for (const route of this.routes) {
            if (TemplateEngine.viewExists(route.file)) {
                const htmlContent = await this.getContent(route.file)

                TemplateEngine.saveFile(route.file, route.directory, htmlContent)
            } else {
                console.log('Warning: View ' + route.file + " was not found.")
            }
        }
    }

    static async serve() {
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