import express from 'express';
import http from 'http';
import cors from 'cors';

import {
  Server
} from 'socket.io';

import {
  registerSocketHandlers
} from './socketHandlers.js';

import {
  getGameState
} from './gameState.js';

const app = express();

const server =
  http.createServer(app);

const PORT =
  Number(
    process.env.PORT || 3001
  );

const CLIENT_URL =
  process.env.CLIENT_URL ||
  'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_URL
  })
);

app.use(
  express.json()
);

const io =
  new Server(
    server,
    {
      cors: {
        origin: CLIENT_URL,
        methods: [
          'GET',
          'POST'
        ]
      }
    }
  );

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      success: true,
      system:
        'Rally Board Pilot',
      status: 'online',
      timestamp:
        new Date().toISOString()
    });
  }
);

app.get(
  '/api/game-state',
  (req, res) => {
    res.json(
      getGameState()
    );
  }
);

io.on(
  'connection',
  (socket) => {
    console.log(
      `[SOCKET] Connected: ${socket.id}`
    );

    socket.emit(
      'server:welcome',
      {
        message:
          'Welcome to Rally Board Pilot',
        timestamp:
          new Date().toISOString()
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
      () => {
        console.log(
          `[SOCKET] Disconnected: ${socket.id}`
        );
      }
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
    console.log(
      `Server: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`State:  http://localhost:${PORT}/api/game-state`);
    console.log('');
    console.log(
      'Waiting for clients...'
    );
    console.log('');
  }
);
