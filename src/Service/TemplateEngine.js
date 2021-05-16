const ejs = require('ejs');
const fs = require('fs');

module.exports = class TemplateEngine {

    static dirFolder = './dist';
    static defaultOptions = {}

    static async renderPage(page, data) {
        return await ejs.renderFile('./views/layout.ejs', Object.assign({page: page}, data), this.defaultOptions);
    }

    static createDistFolder() {
        try {
            fs.rmdirSync(this.dirFolder, { recursive: true });
            fs.mkdirSync(this.dirFolder);
        } catch(err) {
            console.error(err);
        }
    }

    static viewExists(view) {
        return fs.existsSync('./views/pages/'+ view +'.ejs')
    }

    static saveFile(file, dir, content) {
        fs.mkdirSync(this.dirFolder + dir, { recursive: true })

        try {
            fs.writeFileSync(this.dirFolder + dir + "/" + file + ".html", content, {})
        } catch(err) {
            console.error(err);
        }
    }
}