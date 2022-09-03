import fs from 'fs';
import UglifyJS from 'uglify-js';
import { getFileContents } from '../../utils/file.js'
import glslify from 'glslify'


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

ScriptProcessing.gelGLSL = () => {
    const files = fs.readdirSync('./public/assets/glsl');
    let scriptContent = ''

    for (const file of files) {
        const funcName = file.replace(/\.[^/.]+$/, "");

        const content = fs.readFileSync('./public/assets/glsl/'+file, 'utf8');
        
        scriptContent += `const GLSL_${funcName} = \`${glslify(content)}\`; \n` 
    }

    return scriptContent
}

ScriptProcessing.startProcessing = async (files, serveMode = false) => {
    const codeData = await getFileContents(files)

    const minifyLocal = UglifyJS.minify(codeData.local, ScriptProcessing.options.app);

    fs.writeFileSync('./dist/assets/js/app.bundle.js', ScriptProcessing.gelGLSL() + minifyLocal.code, { flag: 'w'})

    console.log("Bundling app scripts")

    if (!serveMode) {
        const minifyRemote = UglifyJS.minify(codeData.remote, ScriptProcessing.options.vendor);

        fs.writeFileSync('./dist/assets/js/chunk-vendors.bundle.js', minifyRemote.code, { flag: 'w'})

        console.log("Bundling vendors")
    }
}


export default ScriptProcessing;