const Routing = require('./Service/Routing');

Routing.route('index', '/')
Routing.route('blog', '/blog')
Routing.usePost('post', '/blog')

module.exports = Routing