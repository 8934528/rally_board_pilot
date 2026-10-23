import { io } from 'socket.io-client';

import { GAME_CONFIG } from '../config/gameConfig';

export const socket = io(
  GAME_CONFIG.serverUrl,
  {
    autoConnect: false,
    transports: ['websocket']
  }
);

export function connectSocket() {
  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export function emitEvent(event, payload) {
  if (!socket.connected) {
    return false;
  }

  socket.emit(event, payload);

  return true;
}
