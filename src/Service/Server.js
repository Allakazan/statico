import WebSocket from "ws";
import chokidar from "chokidar";
import open from "open";
import connect from "connect";
import stat from 'serve-static';

const watchDirs = [
    './public',
    './views',
    './scss',
    './content'
];

const watchSettings = {
    ignoreInitial: true
};

const Server = {}

Server.sockets = []

Server.listenForChanges = (callback) => {
    chokidar.watch(watchDirs, watchSettings).on('all', (event, path) => {
        callback(event, path)
    });          
}

Server.startHTTPServer = () => {
    const server = connect();
    server.use(stat('./dist'));

    server.listen( 3033 );

    console.log('Http server on localhost:3033');
    open('http://localhost:3033');
}

Server.startWSServer = () => {
    const server = new WebSocket.Server({
        port: 3000,
        path: "/ws"
    });
    
    server.on('open', () => {
        console.log('WS server on localhost:3000');
    })

    server.on('connection', (socket) => {
        Server.sockets.push(socket);

        socket.on('close', () => {
            Server.sockets = Server.sockets.filter(s => s !== socket);
        });
    });
}

export default Server;