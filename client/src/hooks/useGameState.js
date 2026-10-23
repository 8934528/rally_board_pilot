import { useEffect, useState } from 'react';

import { GAME_EVENTS } from '../constants/gameEvents';
import { useSocket } from './useSocket';

export function useGameState() {
  const {
    socket,
    connected,
    connectionError
  } = useSocket();

  const [gameState, setGameState] =
    useState(null);

  useEffect(() => {
    const handleState = (state) => {
      setGameState(state);
    };

    socket.on(
      GAME_EVENTS.STATE_UPDATE,
      handleState
    );

    if (socket.connected) {
      socket.emit(
        GAME_EVENTS.STATE_REQUEST
      );
    }

    return () => {
      socket.off(
        GAME_EVENTS.STATE_UPDATE,
        handleState
      );
    };
  }, [socket]);

  return {
    socket,
    connected,
    connectionError,
    gameState
  };
}
