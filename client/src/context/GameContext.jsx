import { createContext, useContext, useMemo, useEffect, useState, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useController } from '../hooks/useController';
import { ROLES } from '../constants/roles';
import { GAME_EVENTS } from '../constants/gameEvents';

const GameContext = createContext(null);

/**
 * @param {{ children: React.ReactNode, role: 'controller'|'host'|'board' }} props
 */
export function GameProvider({ children, role = ROLES.BOARD }) {
  const gameStateData = useGameState(role);
  const controller = useController(gameStateData.socket);

  // Host permissions
  const [hostPermissions, setHostPermissions] = useState(null);

  useEffect(() => {
    const { socket } = gameStateData;

    const handlePermissionUpdate = (perms) => {
      setHostPermissions(perms);
    };

    socket.on(GAME_EVENTS.PERMISSION_UPDATE, handlePermissionUpdate);
    return () => {
      socket.off(GAME_EVENTS.PERMISSION_UPDATE, handlePermissionUpdate);
    };
  }, [gameStateData]);

  useEffect(() => {
    if (gameStateData.gameState?.hostPermissions) {
      setHostPermissions(gameStateData.gameState.hostPermissions);
    }
  }, [gameStateData.gameState?.hostPermissions]);

  // Derived permission check 
  const hasHostPermission = useCallback(
    (action) => {
      if (role === ROLES.CONTROLLER) return true;
      if (role === ROLES.BOARD) return false;
      const perms = hostPermissions || gameStateData.gameState?.hostPermissions;
      return Boolean(perms?.[action]);
    },
    [role, hostPermissions, gameStateData.gameState?.hostPermissions]
  );

  const value = useMemo(
    () => ({
      ...gameStateData,
      controller,
      role,
      hostPermissions: hostPermissions || gameStateData.gameState?.hostPermissions || {},
      hasHostPermission,
      canUndo: gameStateData.gameState?.meta?.canUndo ?? false,
      canRedo: gameStateData.gameState?.meta?.canRedo ?? false,
    }),
    [gameStateData, controller, role, hostPermissions, hasHostPermission]
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
