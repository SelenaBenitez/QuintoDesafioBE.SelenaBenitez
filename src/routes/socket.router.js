// socket.router.js
import express from 'express';
import { Server } from 'socket.io';
import * as SocketController from '../controllers/socket.controller.js';

const router = express.Router();

// Configurar eventos de conexión y desconexión de sockets
router.io = (server) => {
  const io = new Server(server);
  io.on('connection', (socket) => {
    SocketController.handleSocketConnection(io, socket);
  });
};

export default router;
