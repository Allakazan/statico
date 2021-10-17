import fs from "fs";
import config from './config.js';
import ScriptProcessing from './ScriptProcessing.js';
import StyleProcessing from './StyleProcessing.js';
import ImageProcessing from './ImageProcessing.js';

const AssetManagement = {};

AssetManagement.init = (serveMode) => {
    AssetManagement.createFileStructure();

    ScriptProcessing.startProcessing(config.uglifyJS.include, serveMode);
    StyleProcessing.startProcessing();
    ImageProcessing.startProcessing();
}

AssetManagement.createFileStructure = () => {
    fs.mkdirSync('./dist/assets/js', { recursive: true });
    fs.mkdirSync('./dist/assets/css', { recursive: true });
    fs.mkdirSync('./dist/assets/img', { recursive: true });
}

export default AssetManagement;