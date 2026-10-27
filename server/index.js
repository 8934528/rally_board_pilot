import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { registerSocketHandlers } from './socketHandlers.js';

import {
  getGameState
} from './gameState.js';

const app = express();

const server = http.createServer(app);

const PORT = Number(
  process.env.PORT || 3001
);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

const corsOrigin = (origin, callback) => {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (
    allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
  ) {
    callback(null, true);
    return;
  }

  callback(new Error('CORS origin not allowed'));
};

app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      success: true,
      system: 'Rally Board Pilot',
      status: 'online',
      timestamp: new Date().toISOString()
    });
  }
);

app.get(
  '/api/game-state',
  (req, res) => {
    res.json(getGameState());
  }
);

io.on(
  'connection',
  (socket) => {
    console.log(`[SOCKET] Connected: ${socket.id}`
    );

    socket.emit('server:welcome',
      {
        message: 'Welcome to Rally Board Pilot',
        timestamp: new Date().toISOString()
      }
    );

    socket.emit(
      'game:state:update',
      getGameState()
    );

    registerSocketHandlers(
      io,
      socket
    );

    socket.on(
      'disconnect',
      (reason) => {
        console.log(`[SOCKET] Disconnected: ${socket.id} (${reason})`);
      }
    );
  }
);

server.on(
  'error',
  (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n[SERVER ERROR] Port ${PORT} is already in use.`
      );
      console.error(`Stop the process using port ${PORT}, then run npm run dev again.\n`);
      return;
    }

    console.error(
      '[SERVER ERROR]',
      error
    );
  }
);

server.listen(
  PORT,
  () => {
    console.log('');
    console.log('======================================');
    console.log('RALLY BOARD PILOT SERVER');
    console.log('======================================');
    console.log('');
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`State:  http://localhost:${PORT}/api/game-state`);
    console.log('');
    console.log('Waiting for clients...');
    console.log('');
  }
);
