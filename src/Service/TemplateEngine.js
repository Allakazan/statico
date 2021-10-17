import ejs from "ejs";
import fs from "fs";
import fse from "fs-extra";

const dirFolder = './dist';
const defaultOptions = {};

const TemplateEngine = {}

TemplateEngine.serveMode = false

TemplateEngine.renderPage = async(page, data) => {
    return await ejs.renderFile('./views/layout.ejs', Object.assign(
        {page: page},
        data,
        {dev: TemplateEngine.serveMode}
    ), defaultOptions);
}

TemplateEngine.createDistFolder = (serveMode) => {
    try {
        if (!serveMode) fs.rmdirSync(dirFolder, { recursive: true });

        if (!fs.existsSync(dirFolder)) fs.mkdirSync(dirFolder);
    } catch(err) {
        console.error(err);
    }
}

TemplateEngine.viewExists = (view) => {
    return fs.existsSync('./views/pages/'+ view +'.ejs')
}

TemplateEngine.saveFile = (file, dir, content) => {
    fs.mkdirSync(dirFolder + dir, { recursive: true })

    try {
        fs.writeFileSync(dirFolder + dir + "/" + file + ".html", content, {})
    } catch(err) {
        console.error(err);
    }
}

TemplateEngine.copyAssets = () => {
    let files = fs.readdirSync('./public')

    for (const file of files) {
        fse.copySync('./public/'+files, dirFolder + '/' + file);
    }
}

export default TemplateEngine;