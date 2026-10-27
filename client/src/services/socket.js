import { io } from 'socket.io-client';
import { GAME_CONFIG } from '../config/gameConfig';
import { GAME_EVENTS } from '../constants/gameEvents';

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

let pendingRole = null;
let pendingSecret;

function applyRole(role, secret) {
  pendingRole = role;
  pendingSecret = secret || undefined;
  socket.auth = {
    role: pendingRole,
    secret: pendingSecret
  };
}

function registerRole() {
  if (!pendingRole || !socket.connected) return;

  socket.emit(GAME_EVENTS.ROLE_REGISTER, {
    role: pendingRole,
    secret: pendingSecret
  });
}

socket.on('connect', registerRole);

export function setSocketRole(role, secret) {
  applyRole(role, secret);
}

export function connectSocket(role, secret) {
  if (role) {
    applyRole(role, secret ?? (role === pendingRole ? pendingSecret : undefined));
  }

  if (!socket.connected && !socket.active) {
    socket.connect();
    return;
  }

  registerRole();
}

export function emitEvent(event, payload) {
  if (!socket.connected) {
    return false;
  }

  socket.emit(event, payload);

  return true;
}
