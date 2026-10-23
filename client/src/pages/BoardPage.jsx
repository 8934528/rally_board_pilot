import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import GameBoard from '../components/board/GameBoard';

function BoardPage() {
  useDocumentTitle('RBP - BOARD');
  const { gameState, connected } = useGame();

  if (!gameState) {
    return (
      <div className="board-loading">
        <div className="loading-logo">RBP</div>
        <span>CONNECTING TO GAME SERVER...</span>
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
