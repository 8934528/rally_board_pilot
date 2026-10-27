import { useState, useEffect } from 'react';
import AnnouncementPage from './AnnouncementPage';
import RoundPage from './RoundPage';
import Scoreboard from './Scoreboard';
import TimerPage from './TimerPage';
import WheelPage from './WheelPage';
import WinnerPage from './WinnerPage';
import QuestionPage from './QuestionPage';
import RoundTransitionModal from './RoundTransitionModal';

import FullscreenButton from '../common/FullscreenButton';
import ConnectionStatus from '../common/ConnectionStatus';

function GameBoard({ gameState, connected }) {
  const theme = gameState.board.theme;
  const activePage = gameState.board.activePage;

  const [displayedPage, setDisplayedPage] = useState(activePage);
  const [transitioning, setTransitioning] = useState(false);

  const [showRoundModal, setShowRoundModal] = useState(false);
  const [lastRoundNum, setLastRoundNum] = useState(gameState.round.number);

  useEffect(() => {
    if (activePage !== displayedPage) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedPage(activePage);
        setTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activePage, displayedPage]);

  useEffect(() => {
    if (gameState.roundTransition?.active) {
      setShowRoundModal(true);
      return;
    }

    if (gameState.round.number !== lastRoundNum) {
      setShowRoundModal(true);
      setLastRoundNum(gameState.round.number);
      const timer = setTimeout(() => {
        setShowRoundModal(false);
      }, 2300);
      return () => clearTimeout(timer);
    }
  }, [gameState.round.number, gameState.roundTransition, lastRoundNum]);

  const boardStyle = {
    '--team-a-color': gameState.teams.A.color,
    '--team-b-color': gameState.teams.B.color,
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-direction': theme.direction
  };

  const renderActiveView = () => {
    switch (displayedPage) {
      case 'round':
        return <RoundPage gameState={gameState} />;
      case 'timer':
        return <TimerPage gameState={gameState} />;
      case 'wheel':
        return <WheelPage gameState={gameState} />;
      case 'question':
        return <QuestionPage gameState={gameState} />;
      case 'announcement':
        return <AnnouncementPage gameState={gameState} />;
      case 'winner':
        return <WinnerPage gameState={gameState} />;
      case 'scoreboard':
      default:
        return <Scoreboard gameState={gameState} />;
    }
  };

  return (
    <main className="rally-board-fullscreen" style={boardStyle} id="board-viewport">
      <header className="board-header-minimal" id="board-header">
        {/* Left: Connection dot only, NO text! */}
        <div className="board-header-left">
          <ConnectionStatus connected={connected} dotOnly={true} />
        </div>

        <div className="board-header-center">
          <div className="board-round-pill">
            <span className="round-pill-text">Round {gameState.round.number}</span>
          </div>
        </div>

        <div className="board-header-right">
          <FullscreenButton variant="ghost" size="small" />
        </div>
      </header>

      <div className={`board-display-area ${transitioning ? 'page-fade-out' : 'page-fade-in'}`}>
        {renderActiveView()}
      </div>

      <RoundTransitionModal
        roundNumber={gameState.round.number}
        roundName={gameState.round.name}
        active={showRoundModal}
      />
    </main>
  );
}

export default GameBoard;
