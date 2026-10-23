import { io } from 'socket.io-client';

import { GAME_CONFIG } from '../config/gameConfig';

export const socket = io(
  GAME_CONFIG.serverUrl,
  {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000,
    timeout: 10000
  }
);

export function connectSocket() {
  if (!socket.connected && !socket.active) {
    socket.connect();
  }
}

export function emitEvent(event, payload) {
  if (!socket.connected) {
    return false;
  }

  socket.emit(event, payload);

  return true;
}
