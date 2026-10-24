import { useLayoutEffect, useRef, useState } from 'react';
import Scoreboard from '../board/Scoreboard';
import RoundPage from '../board/RoundPage';
import TimerPage from '../board/TimerPage';
import WheelPage from '../board/WheelPage';
import AnnouncementPage from '../board/AnnouncementPage';
import WinnerPage from '../board/WinnerPage';
import { BOARD_PAGES } from '../../constants/pages';

export const VIRTUAL_BOARD_WIDTH = 1920;
export const VIRTUAL_BOARD_HEIGHT = 1080;

function renderBoardPage(page, gameState) {
  switch (page) {
    case BOARD_PAGES.ROUND:
      return <RoundPage gameState={gameState} />;
    case BOARD_PAGES.TIMER:
      return <TimerPage gameState={gameState} />;
    case BOARD_PAGES.WHEEL:
      return <WheelPage gameState={gameState} showResultModal={false} />;
    case BOARD_PAGES.ANNOUNCEMENT:
      return <AnnouncementPage gameState={gameState} />;
    case BOARD_PAGES.WINNER:
      return <WinnerPage gameState={gameState} />;
    case BOARD_PAGES.SCOREBOARD:
    default:
      return <Scoreboard gameState={gameState} />;
  }
}

export function BoardPreviewFrame({ gameState, page }) {
  const frameRef = useRef(null);
  const [scale, setScale] = useState(0.3);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;

    const update = () => {
      setScale(el.clientWidth / VIRTUAL_BOARD_WIDTH);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const theme = gameState.board.theme;

  const boardStyle = {
    '--team-a-color': gameState.teams.A.color,
    '--team-b-color': gameState.teams.B.color,
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-direction': theme.direction
  };

  return (
    <div className="board-preview-frame" ref={frameRef}>
      <div
        className="board-preview-stage"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className="rally-board-fullscreen board-preview-virtual"
          style={boardStyle}
          aria-hidden="true"
        >
          <header className="board-header-minimal">
            <div className="board-header-left" />

            <div className="board-header-center">
              <div className="board-round-pill">
                <span className="round-pill-text">Round {gameState.round.number}</span>
              </div>
            </div>

            <div className="board-header-right" />
          </header>

          <div className="board-display-area">
            {renderBoardPage(page, gameState)}
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardPreview({ gameState }) {
  return (
    <div className="board-preview">
      <div className="board-preview-caption">
        <span>LIVE BOARD PREVIEW</span>
        <span>Mirrors what the Board displays</span>
      </div>

      <BoardPreviewFrame
        gameState={gameState}
        page={gameState.board.activePage}
      />
    </div>
  );
}

export default BoardPreview;
