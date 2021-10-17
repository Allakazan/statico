import fs from 'fs';
import fse from 'fs-extra';

const ImageProcessing = {};

ImageProcessing.startProcessing = async () => {
    let files = fs.readdirSync('./public/assets/img')

    for (const file of files) {
        fse.copySync('./public/assets/img/'+file, './dist/assets/img/' + file);
    }
}

export default ImageProcessing;