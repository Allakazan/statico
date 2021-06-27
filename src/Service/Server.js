const WebSocket = require('ws');
const chokidar = require('chokidar');
const open = require('open');

let watchDirs = [
    './public',
    './views',
    './content'
];

let watchSettings = {
    ignoreInitial: true
};

module.exports = {
    sockets: [],

    listenForChanges(callback) {
        chokidar.watch(watchDirs, watchSettings).on('all', (event, path) => {
            callback(event, path)
        });          
    },
    startHTTPServer() {
        const connect = require('connect');
        const stat = require('serve-static');

        const server = connect();
        server.use(stat('./dist'));

        server.listen( 3033 );

        console.log('Http server on localhost:3033');
        open('http://localhost:3033');
    },
    startWSServer() {
        const server = new WebSocket.Server({
            port: 3000,
            path: "/ws"
        });
        
        server.on('open', () => {
            console.log('WS server on localhost:3000');
        })

        server.on('connection', (socket) => {
            this.sockets.push(socket);

            socket.on('close', () => {
                this.sockets = this.sockets.filter(s => s !== socket);
            });
        });
    }
}