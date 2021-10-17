import fs from 'fs';
import UglifyJS from 'uglify-js';
import { getFileContents } from '../../utils/file.js'

const ScriptProcessing = {};

ScriptProcessing.options = {
    app: {
        nameCache: {},
        output: {
            preamble: "/* do not touch here kiddo */"
        }
    },
    vendor: {
        nameCache: {},
        compress: false,
        mangle: false,
        output: { 
            preamble: "/* site vendors. rly dont touch here. */"
        }
    }
}

ScriptProcessing.startProcessing = async (files, serveMode = false) => {
    const codeData = await getFileContents(files)

    const minifyLocal = UglifyJS.minify(codeData.local, ScriptProcessing.options.app);
    
    fs.writeFileSync('./dist/assets/js/app.bundle.js', minifyLocal.code, { flag: 'w'})

    console.log("Bundling app scripts")

    if (!serveMode) {
        const minifyRemote = UglifyJS.minify(codeData.remote, ScriptProcessing.options.vendor);

        fs.writeFileSync('./dist/assets/js/chunk-vendors.bundle.js', minifyRemote.code, { flag: 'w'})

        console.log("Bundling vendors")
    }
}


export default ScriptProcessing;