import { useEffect, useState } from 'react';
import { GAME_EVENTS } from '../constants/gameEvents';
import { useSocket } from './useSocket';
import { ROLES } from '../constants/roles';

/**
 * @param {'controller'|'host'|'board'} role
 */
export function useGameState(role = ROLES.BOARD) {
  const {
    socket,
    connected,
    connectionError
  } = useSocket(role);

  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const handleState = (state) => {
      setGameState(state);
    };

    socket.on(
      GAME_EVENTS.STATE_UPDATE,
      handleState
    );

    if (socket.connected) {
      socket.emit(GAME_EVENTS.STATE_REQUEST);
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
