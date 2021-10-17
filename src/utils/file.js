import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { URL } from "url";

export const downloadAsset = async (filePath) => {
    
    const fileID = Buffer.from(filePath).toString('base64');
    let fileData = '';

    if (!fs.existsSync('./cache/')) fs.mkdirSync('./cache/');

    if (fs.existsSync('./cache/' + fileID)) {
        fileData = fs.readFileSync('./cache/' + fileID, { encoding: 'utf-8'})

    } else {
        const { data } = await axios.get(filePath)

        fs.writeFileSync('./cache/' + fileID, data, { flag: 'w'})

        fileData = data;
    }

    return fileData;
}

export const isValidHttpUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export const getFileContents = async (files) => {
    let fileData = {
        remote: {},
        local: {}
    };

    for (const file of files) {
        if (isValidHttpUrl(file)) {
            fileData.remote[path.basename(file)] = await downloadAsset(file)
        } else {
            fileData.local[path.basename(file)] = fs.readFileSync(path.resolve(file), 'utf8')
        }
    }

    return fileData;
}

export const getAllFiles = (dirPath, arrayOfFiles) => {
    let files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach((file) => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = AssetManagement.getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push({
                file,
                dirPath
            })
        }
    })

    return arrayOfFiles
}
