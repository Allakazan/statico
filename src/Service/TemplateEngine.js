const ejs = require('ejs');
const fs = require('fs');
const fse = require('fs-extra');

let dirFolder = './dist';
let defaultOptions = {};

module.exports = {
    serveMode: false,
    async renderPage(page, data) {
        return await ejs.renderFile('./views/layout.ejs', Object.assign({page: page}, data, {dev: this.serveMode}), defaultOptions);
    },
    createDistFolder() {
        try {
            fs.rmdirSync(dirFolder, { recursive: true });
            fs.mkdirSync(dirFolder);
        } catch(err) {
            console.error(err);
        }
    },
    viewExists(view) {
        return fs.existsSync('./views/pages/'+ view +'.ejs')
    },
    saveFile(file, dir, content) {
        fs.mkdirSync(dirFolder + dir, { recursive: true })

        try {
            fs.writeFileSync(dirFolder + dir + "/" + file + ".html", content, {})
        } catch(err) {
            console.error(err);
        }
    },
    copyAssets() {
        let files = fs.readdirSync('./public')

        for (const file of files) {
            fse.copySync('./public/'+files, dirFolder + '/' + file);
        }
    }
}