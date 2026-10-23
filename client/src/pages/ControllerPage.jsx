import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

import ControllerSidebar from '../components/controller/ControllerSidebar';
import ScoreControls from '../components/controller/ScoreControls';
import TeamConfig from '../components/controller/TeamConfig';
import QuickActions from '../components/controller/QuickActions';
import BoardDirector from '../components/controller/BoardDirector';
import RoundDirector from '../components/controller/RoundDirector';
import BoardPreview from '../components/controller/BoardPreview';
import ThemeEditor from '../components/controller/ThemeEditor';
import FullscreenButton from '../components/common/FullscreenButton';
import ConnectionStatus from '../components/common/ConnectionStatus';
import TimerConfigModal from '../components/common/TimerConfigModal';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';
import PageManager from '../components/controller/PageManager';

function ControllerPage() {
  useDocumentTitle('RBP - CONTROLLER');

  const {
    connected,
    gameState,
    controller
  } = useGame();

  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const shortcuts = useMemo(
    () => ({
      l: () => controller.updateStatus('LIVE'),
      p: () => controller.updateStatus('PAUSED'),
      r: () => controller.resetGame(),
      n: () => {
        if (gameState?.round) {
          const nextNum = gameState.round.number + 1;
          controller.updateRound(nextNum, `Round ${nextNum}`);
        }
      },
      space: () => {
        if (gameState?.timer?.running) {
          controller.pauseTimer();
        } else {
          controller.startTimer();
        }
      },
      w: () => {
        controller.spinWheel();
      },
      t: () => {
        setTimerModalOpen((prev) => !prev);
      }
    }),
    [controller, gameState?.round, gameState?.timer?.running]
  );

  useKeyboardShortcuts(shortcuts);

  if (!gameState) {
    return (
      <div className="controller-loading">
        <div className="loading-logo-box">RBP</div>
        <span>CONNECTING TO GAME SERVER...</span>
      </div>
    );
  }

  const handleReset = () => {
    controller.resetGame();
  };

  return (
    <div className="controller-shell" id="controller-root">
      <header className="controller-topbar" id="controller-topbar">
        <div className="controller-brand">
          <button
            type="button"
            className="mobile-drawer-toggle-btn d-lg-none"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open mobile navigation drawer"
          >
            <i className="bi bi-list" />
          </button>

          <div className="controller-logo">
            <span>RBP</span>
          </div>

          <div className="controller-identity">
            <span className="controller-title">CONTROLLER</span>
          </div>
        </div>

        <div className="controller-header-center">
          <BoardDirector
            activePage={gameState.board.activePage}
            status={gameState.status}
          />
        </div>

        <div className="controller-header-actions">
          <ConnectionStatus connected={connected} label={true} />

          <Link
            to="/activity"
            className="header-icon-link"
            title="Activity Log"
            id="header-activity-link"
          >
            <i className="bi bi-clock-history" />
            <span className="d-none d-md-inline">Activity</span>
          </Link>

          <FullscreenButton />
        </div>
      </header>

      <div className="controller-layout" id="controller-layout">
        {/* Desktop Sidebar */}
        <ControllerSidebar
          activePage={gameState.board.activePage}
          status={gameState.status}
          timerSeconds={gameState.timer.seconds}
          isTimerRunning={gameState.timer.running}
          onPageChange={controller.changePage}
          onStatusChange={controller.updateStatus}
          onOpenTimerModal={() => setTimerModalOpen(true)}
          onOpenThemeModal={() => setThemeModalOpen(true)}
        />

        <main className="controller-main" id="controller-main-content">
          <div className="controller-page-heading">
            <div className="control-room-header">
              <div className="eyebrow">CONTROL ROOM</div>
            </div>

            <QuickActions
              onLive={() => controller.updateStatus('LIVE')}
              onPause={() => controller.updateStatus('PAUSED')}
              onReset={handleReset}
              status={gameState.status}
            />
          </div>


          <section className="control-grid" aria-label="Team Scores">
            <ScoreControls
              team="A"
              teamData={gameState.teams.A}
              onAdd={controller.addScore}
              onSubtract={controller.subtractScore}
            />

            <ScoreControls
              team="B"
              teamData={gameState.teams.B}
              onAdd={controller.addScore}
              onSubtract={controller.subtractScore}
            />
          </section>

          <section className="wide-control-card">
            <RoundDirector
              round={gameState.round}
              onUpdateRound={controller.updateRound}
            />
          </section>



          <div className="controller-two-column-row" id="setup-monitor-row">
            
            <section className="control-card setup-config-card" id="setup-config-card">
              <div className="wide-card-heading">
                <div>
                  <div className="eyebrow">SETUP</div>
                  <h2>Configuration</h2>
                </div>
              </div>

              <div className="team-config-grid">
                <TeamConfig
                  team="A"
                  teamData={gameState.teams.A}
                  onUpdate={controller.updateTeam}
                />

                <TeamConfig
                  team="B"
                  teamData={gameState.teams.B}
                  onUpdate={controller.updateTeam}
                />
              </div>
            </section>


            <section className="control-card monitor-preview-card" id="monitor-preview-card">
              <div className="wide-card-heading">
                <div>
                  <div className="eyebrow">MONITOR</div>
                  <h2>Live Screen Preview</h2>
                </div>
                <button
                  type="button"
                  className="btn-link-action"
                  onClick={() => setThemeModalOpen(true)}
                  aria-label="Edit board theme"
                >
                  <i className="bi bi-palette" /> Edit Theme
                </button>
              </div>
              <BoardPreview gameState={gameState} />
            </section>
          </div>
        </main>
      </div>


      <TimerConfigModal
        open={timerModalOpen}
        onClose={() => setTimerModalOpen(false)}
        currentSeconds={gameState.timer.seconds}
        onSetTimer={controller.setTimer}
        onStart={controller.startTimer}
        onPause={controller.pauseTimer}
        onReset={controller.resetTimer}
        isRunning={gameState.timer.running}
      />


      <Modal
        open={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        title="BOARD THEME SELECTION"
        size="medium"
      >
        <ThemeEditor
          currentTheme={gameState.board.theme}
          onChange={(newTheme) => {
            controller.updateTheme(newTheme);
            setThemeModalOpen(false);
          }}
        />
      </Modal>

      <Drawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        title="CONTROLLER NAVIGATION"
        id="invokerDrawer"
      >
        <div className="mobile-drawer-content">
          <div className="drawer-section">
            <span className="drawer-section-title">GAME STATUS</span>
            <div className="d-flex flex-column gap-1">
              {['READY', 'LIVE', 'PAUSED', 'FINISHED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`status-control-btn ${gameState.status === st ? 'active' : ''}`}
                  onClick={() => {
                    controller.updateStatus(st);
                    setMobileDrawerOpen(false);
                  }}
                >
                  <span className={`status-indicator-dot ${gameState.status === st ? 'dot-active' : ''}`} />
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="drawer-section">
            <span className="drawer-section-title">BOARD VIEW</span>
            <PageManager
              activePage={gameState.board.activePage}
              onChange={(p) => {
                controller.changePage(p);
                setMobileDrawerOpen(false);
              }}
            />
          </div>

          <div className="drawer-section">
            <span className="drawer-section-title">TOOLS</span>
            <button
              type="button"
              className="sidebar-tool-btn w-100 mb-2"
              onClick={() => {
                setMobileDrawerOpen(false);
                setTimerModalOpen(true);
              }}
            >
              <i className="bi bi-stopwatch" />
              <span>Configure Timer ({gameState.timer.seconds}s)</span>
            </button>

            <Link
              to="/activity"
              className="sidebar-tool-btn w-100"
              onClick={() => setMobileDrawerOpen(false)}
            >
              <i className="bi bi-clock-history" />
              <span>Activity Log</span>
            </Link>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default ControllerPage;
