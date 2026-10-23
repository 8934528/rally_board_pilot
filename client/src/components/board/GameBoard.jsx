import AnnouncementPage from './AnnouncementPage';
import RoundPage from './RoundPage';
import Scoreboard from './Scoreboard';
import TimerPage from './TimerPage';
import WheelPage from './WheelPage';
import WinnerPage from './WinnerPage';

import FullscreenButton from '../common/FullscreenButton';
import ConnectionStatus from '../common/ConnectionStatus';

function GameBoard({
  gameState,
  connected
}) {
  const theme =
    gameState.board.theme;

  const boardStyle = {
    '--team-a-color':
      gameState.teams.A.color,

    '--team-b-color':
      gameState.teams.B.color,

    '--theme-primary':
      theme.primary,

    '--theme-secondary':
      theme.secondary,

    '--theme-direction':
      theme.direction
  };

  const renderPage = () => {
    switch (
      gameState.board.activePage
    ) {
      case 'round':
        return (
          <RoundPage
            gameState={gameState}
          />
        );

      case 'timer':
        return (
          <TimerPage
            gameState={gameState}
          />
        );

      case 'wheel':
        return (
          <WheelPage
            gameState={gameState}
          />
        );

      case 'announcement':
        return (
          <AnnouncementPage
            gameState={gameState}
          />
        );

      case 'winner':
        return (
          <WinnerPage
            gameState={gameState}
          />
        );

      case 'scoreboard':
      default:
        return (
          <Scoreboard
            gameState={gameState}
          />
        );
    }
  };

  return (
    <main
      className="rally-board"
      style={boardStyle}
    >
      <header className="board-header">

        <div>
          <div className="brand-mark">
            RALLY BOARD
          </div>

          <div className="brand-subtitle">
            PILOT
          </div>
        </div>

        <div className="round-display">
          <span className="round-label">
            ROUND {gameState.round.number}
          </span>

          <span className="round-name">
            {gameState.round.name}
          </span>
        </div>

        <div className="board-actions">
          <ConnectionStatus
            connected={connected}
          />

          <FullscreenButton />
        </div>

      </header>

      <div className="board-content">
        {renderPage()}
      </div>

      <footer className="board-footer">

        <div className="game-status">
          {gameState.status}
        </div>

        <div className="footer-center">
          {gameState.teams.A.name}
          {'  '}
          {gameState.teams.A.score}
          {'  —  '}
          {gameState.teams.B.score}
          {'  '}
          {gameState.teams.B.name}
        </div>

        <div className="connection-status">
          RALLY BOARD PILOT
        </div>

      </footer>
    </main>
  );
}

export default GameBoard;
