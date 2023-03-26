import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on("connection", (socket) => {
  console.log(socket.id, 'has been connected');

  socket.on('disconnecting', () => {
    console.log('anonymous is disconnecting', socket.rooms);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`listening on http://localhost:${process.env.PORT || 5000}`);
}); 
