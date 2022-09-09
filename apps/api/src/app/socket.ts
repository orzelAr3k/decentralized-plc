import { Server } from 'socket.io';

const io = new Server(3000, {
    cors: { origin: "http://localhost:4200" }
});

export default io;
