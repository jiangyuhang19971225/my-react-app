import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const server = express();
const httpServer = http.createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // 允许前端域名
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // 断开连接处理
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // 消息接收和广播
  socket.on('send_message', (data) => {
    console.log('Received message:', data);
    io.emit('receive_message', data); // 广播给所有人
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
