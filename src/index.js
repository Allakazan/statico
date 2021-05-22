const Routes = require('./routes');

let action = process.argv.slice(2)[0] ? process.argv.slice(2)[0] : 'serve';

Routes.init(action)