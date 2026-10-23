import { createContext, useContext, useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useController } from '../hooks/useController';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const gameStateData = useGameState();
  const controller = useController(gameStateData.socket);

  const value = useMemo(
    () => ({
      ...gameStateData,
      controller
    }),
    [gameStateData, controller]
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
