import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { registerSocketHandlers } from './socketHandlers.js';
import { getGameState } from './gameState.js';

const app = express();
const server = http.createServer(app);

const PORT = 3001;

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    system: 'Rally Board Pilot',
    status: 'online'
  });
});

app.get('/api/game-state', (req, res) => {
  res.json(getGameState());
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit('server:welcome', {
    message: 'Welcome to Rally Board Pilot',
    timestamp: new Date().toISOString()
  });

  socket.emit('game:state:update', getGameState());

  registerSocketHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('======================================');
  console.log('      RALLY BOARD PILOT SERVER');
  console.log('======================================');
  console.log('');
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Game:   http://localhost:${PORT}/api/game-state`);
  console.log('');
  console.log('Waiting for clients...');
  console.log('');
});
