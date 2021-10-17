import Routing from "./Service/Routing.js";

Routing.route('index', '/')
Routing.route('blog', '/blog')
Routing.usePost('post', '/blog')

export default Routing;