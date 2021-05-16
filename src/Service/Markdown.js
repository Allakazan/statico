const jdown = require('jdown');

module.exports = class Markdown {
    static async renderMarkdown() {
        return await jdown('content', {
            markdown: {
                highlight: function(code, language) {
                    const hljs = require("highlight.js");
                    const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
                    return hljs.highlight(code, {language: validLanguage}).value;
                },
                breaks: false,
                sanitize: false,
                headerIds: false
            }
        });
    }
}