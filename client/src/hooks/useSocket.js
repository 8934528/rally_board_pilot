import { useEffect, useState } from 'react';

import { socket, connectSocket, disconnectSocket } from '../services/socket';

export function useSocket() {
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
      setConnectionError(
        error?.message || 'Connection failed'
      );
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);

    connectSocket();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);

      disconnectSocket();
    };
  }, []);

  return {
    socket,
    connected,
    connectionError
  };
}
