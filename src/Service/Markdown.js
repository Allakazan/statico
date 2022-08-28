import jdown from "jdown";
import hljs from "highlight.js";

const Markdown = {}

Markdown.renderMarkdown = async () => {
    return await jdown('content', {
        fileInfo: true,
        markdown: {
            highlight: function(code, language) {
                const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
                return hljs.highlight(code, {language: validLanguage}).value;
            },
            breaks: true,
            sanitize: false,
            headerIds: false
        }
    });
}

export default Markdown;