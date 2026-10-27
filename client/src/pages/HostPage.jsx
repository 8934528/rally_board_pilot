import { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

import HostControls from '../components/host/HostControls';
import HostRoundControls from '../components/host/HostRoundControls';
import HostScorePanel from '../components/host/HostScorePanel';
import HostWheelControls from '../components/host/HostWheelControls';
import HostTimerControls from '../components/host/HostTimerControls';
import ConnectionStatus from '../components/common/ConnectionStatus';
import FullscreenButton from '../components/common/FullscreenButton';

function HostPage() {
  useDocumentTitle('RBP - HOST');

  const {
    connected,
    gameState,
    controller: host,
    hasHostPermission
  } = useGame();

  const canScore = hasHostPermission('score');
  const canRound = hasHostPermission('round');
  const canStatus = hasHostPermission('status');
  const canTimer = hasHostPermission('timer');
  const canWheel = hasHostPermission('wheel');
  const hasAnyControl = canScore || canRound || canStatus || canTimer || canWheel;

  const shortcuts = useMemo(() => {
    const map = {};

    if (canStatus) {
      map.l = () => host.updateStatus('LIVE');
      map.p = () => host.updateStatus('PAUSED');
    }

    if (canRound) {
      map.n = () => {
        if (gameState?.round) {
          const nextNum = gameState.round.number + 1;
          host.updateRound(nextNum, `Round ${nextNum}`);
        }
      };
    }

    if (canWheel) {
      map['shift+x'] = () => host.spinWheel();
    }

    if (canTimer) {
      map.space = () => {
        if (gameState?.timer?.running) {
          host.pauseTimer();
        } else {
          host.startTimer();
        }
      };
    }

    return map;
  }, [
    host,
    gameState?.round,
    gameState?.timer?.running,
    canStatus,
    canRound,
    canWheel,
    canTimer
  ]);

  useKeyboardShortcuts(shortcuts);

  if (!gameState) {
    return (
      <div className="host-loading">
        <div className="loading-logo-box">
          RBP
        </div>

        <span>
          CONNECTING TO GAME SERVER...
        </span>
      </div>
    );
  }

  return (
    <div
      className="host-shell"
      id="host-root"
    >
      <header
        className="host-topbar"
        id="host-topbar"
      >
        <div className="host-brand">
          <div className="host-logo">
            RBP
          </div>

          <span className="host-title">
            HOST
          </span>
        </div>

        <div className="host-header-actions">
          <ConnectionStatus
            connected={connected}
            label={false}
            dotOnly
          />

          <FullscreenButton />
        </div>
      </header>

      <main
        className="host-main"
        id="host-main-content"
      >
        <div className="host-grid-layout">
          <div className="host-page-heading">
            <div className="host-room-header">
              <div className="eyebrow">HOST ROOM</div>
            </div>

            <HostControls
              onLive={() => host.updateStatus('LIVE')}
              onPause={() => host.updateStatus('PAUSED')}
              onPage={host.changePage}
              status={gameState.status}
              activePage={gameState.board.activePage}
            />
          </div>

          {!hasAnyControl && (
            <div
              className="host-no-access"
              role="status"
            >
              <i className="bi bi-lock" aria-hidden="true" />
              <h2>NO CONTROLS GRANTED</h2>
              <p>
                The Controller has not granted this Host any actions yet. Scores, round, timer, and wheel stay visible for reference.
              </p>
            </div>
          )}

          <div className="host-team-round-row">
            <div className="host-col-4">
              <HostScorePanel
                team="A"
                gameState={gameState}
                onAdd={host.addScore}
                onSubtract={host.subtractScore}
              />
            </div>

            <div className="host-col-4">
              <HostScorePanel
                team="B"
                gameState={gameState}
                onAdd={host.addScore}
                onSubtract={host.subtractScore}
              />
            </div>

            <div className="host-col-4">
              <HostRoundControls
                gameState={gameState}
                onRound={host.updateRound}
              />
            </div>
          </div>

          <div className="host-clock-wheel-row">
            <div className="host-col-5">
              <HostTimerControls
                gameState={gameState}
                onStart={host.startTimer}
                onPause={host.pauseTimer}
                onReset={host.resetTimer}
                onSetTimer={host.setTimer}
                onPage={host.changePage}
              />
            </div>

            <div className="host-col-7">
              <HostWheelControls
                gameState={gameState}
                onPage={host.changePage}
                onSpin={host.spinWheel}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HostPage;
