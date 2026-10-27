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

let _pendingRole = null;
let _pendingSecret = null;

/**
 * @param {'controller'|'host'|'board'} role
 * @param {string} [secret] - controller secret
 */
export function setSocketRole(role, secret) {
  _pendingRole = role;
  _pendingSecret = secret || undefined;
  socket.auth = {
    role: _pendingRole,
    secret: _pendingSecret
  };
}

socket.on('connect', () => {
  if (_pendingRole) {
    socket.emit(GAME_EVENTS.ROLE_REGISTER, {
      role: _pendingRole,
      secret: _pendingSecret
    });
  }
});

export function connectSocket(role, secret) {
  if (role) {
    _pendingRole = role;
    _pendingSecret = secret;
    socket.auth = {
      role: _pendingRole,
      secret: _pendingSecret
    };
  }

  if (!socket.connected && !socket.active) {
    socket.connect();
  } else if (socket.connected && _pendingRole) {
    // connected – register immediately
    socket.emit(GAME_EVENTS.ROLE_REGISTER, {
      role: _pendingRole,
      secret: _pendingSecret
    });
  }
}

export function emitEvent(event, payload) {
  if (!socket.connected) {
    return false;
  }

  socket.emit(event, payload);

  return true;
}
