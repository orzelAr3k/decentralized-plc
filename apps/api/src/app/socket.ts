import { Server } from 'socket.io';
import { createServer } from 'http';

const server = createServer(function (req, res) {
    res.writeHead(200);
    res.end("socket\n");
}).listen(3000);

const io = new Server(server, {
    cors: { origin: "*" }
});

export default io;
