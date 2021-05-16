const TemplateEngine = require('./TemplateEngine');
const Markdown = require('./Markdown');

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
        
        for (const route of this.routes) {
            if (TemplateEngine.viewExists(route.file)) {
                const htmlContent = await this.getContent(route.file)

                TemplateEngine.saveFile(route.file, route.directory, htmlContent)
            } else {
                console.log('Warning: View ' + route.file + " was not found.")
            }
        }
    }
}