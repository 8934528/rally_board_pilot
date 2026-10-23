import { useEffect, useState } from 'react';

import {
  socket,
  connectSocket,
  disconnectSocket
} from '../services/socket';

export function useSocket() {
  const [connected, setConnected] = useState(socket.connected);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleWelcome = (data) => {
      setWelcomeMessage(data.message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('server:welcome', handleWelcome);

    connectSocket();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('server:welcome', handleWelcome);

      disconnectSocket();
    };
  }, []);

  return {
    socket,
    connected,
    welcomeMessage
  };
}
