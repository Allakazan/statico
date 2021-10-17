import fs from 'fs';
import fse from 'fs-extra';

const StyleProcessing = {};

StyleProcessing.startProcessing = async () => {
    let files = fs.readdirSync('./public/assets/css')

    for (const file of files) {
        fse.copySync('./public/assets/css/'+file, './dist/assets/css/' + file);
    }
}

export default StyleProcessing;