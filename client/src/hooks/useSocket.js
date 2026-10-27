import { useEffect, useState } from 'react';
import { ROLES } from '../constants/roles';
import { socket, connectSocket } from '../services/socket';
import { GAME_EVENTS } from '../constants/gameEvents';

/**
 * @param {'controller'|'host'|'board'} role - role to register with the server
 */
export function useSocket(role = ROLES.BOARD) {
  const [connected, setConnected] = useState(socket.connected);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleError = (error) => {
      setConnected(false);
      setConnectionError(
        error?.message || 'Connection failed'
      );
    };

    const handlePermissionDenied = ({ action, message }) => {
      console.warn(`[PERMISSION] ${action}: ${message}`);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);
    socket.on(GAME_EVENTS.PERMISSION_DENIED, handlePermissionDenied);

    if (!socket.connected) {
      connectSocket(role);
    } else {
      setConnected(true);
      socket.emit(GAME_EVENTS.ROLE_REGISTER, { role });
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
      socket.off(GAME_EVENTS.PERMISSION_DENIED, handlePermissionDenied);
    };
  }, [role]);

  return {
    socket,
    connected,
    connectionError
  };
}
