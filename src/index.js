import Routing from "./routes.js";

let action = process.argv.slice(2)[0] ? process.argv.slice(2)[0] : 'serve';

Routing.init(action)