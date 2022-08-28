import fs from 'fs';
import fse from 'fs-extra';
import sass from 'sass'

const StyleProcessing = {};

StyleProcessing.startProcessing = async () => {
    const {css, sourceMap} = sass.compile('./scss/styles.scss', {style: "compressed", sourceMap: true});

    fs.writeFileSync('./dist/assets/css/app.bundle.css', css, { flag: 'w'});
    fs.writeFileSync('./dist/assets/css/app.bundle.css.map', JSON.stringify(sourceMap), { flag: 'w'});
}

export default StyleProcessing;