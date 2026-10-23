import { useGameState } from '../hooks/useGameState';

import GameBoard from '../components/board/GameBoard';

function BoardPage() {
  const {
    gameState,
    connected
  } = useGameState();

  if (!gameState) {
    return (
      <div className="board-loading">
        <div className="loading-logo">
          RBP
        </div>

        <h1>
          RALLY BOARD PILOT
        </h1>

        <p>
          Connecting to game server...
        </p>
      </div>
    );
  }

  return (
    <GameBoard
      gameState={gameState}
      connected={connected}
    />
  );
}

export default BoardPage;
