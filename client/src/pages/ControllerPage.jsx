import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { BOARD_PAGES } from '../constants/pages';

import ControllerSidebar from '../components/controller/ControllerSidebar';
import ScoreControls from '../components/controller/ScoreControls';
import TeamConfig from '../components/controller/TeamConfig';
import QuickActions from '../components/controller/QuickActions';
import BoardDirector from '../components/controller/BoardDirector';
import RoundDirector from '../components/controller/RoundDirector';
import BoardPreview from '../components/controller/BoardPreview';
import AnnouncementControl from '../components/controller/AnnouncementControl';
import ThemeEditor from '../components/controller/ThemeEditor';
import FullscreenButton from '../components/common/FullscreenButton';
import ConnectionStatus from '../components/common/ConnectionStatus';
import SoundToggle from '../components/common/SoundToggle';
import TimerConfigModal from '../components/common/TimerConfigModal';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import WheelConfigModal from '../components/controller/WheelConfigModal';
import HostPermissionsModal from '../components/controller/HostPermissionsModal';
import QuestionManagerModal from '../components/controller/QuestionManagerModal';
import GameStatsModal from '../components/controller/GameStatsModal';

function ControllerPage() {
  useDocumentTitle('RBP - CONTROLLER');

  const {
    connected,
    gameState,
    controller,
    canUndo,
    canRedo
  } = useGame();

  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [wheelModalOpen, setWheelModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const [announcementEditing, setAnnouncementEditing] = useState(false);
  const [announcementDraft, setAnnouncementDraft] = useState(null);

  const shortcuts = useMemo(
    () => ({
      l: () => controller.updateStatus('LIVE'),
      p: () => controller.updateStatus('PAUSED'),
      r: () => setResetConfirmOpen(true),
      u: () => {
        if (canUndo) controller.undo();
      },
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
      'shift+x': () => {
        controller.spinWheel();
      },
      t: () => {
        setTimerModalOpen((prev) => !prev);
      }
    }),
    [controller, canUndo, gameState?.round, gameState?.timer?.running]
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

  const boardPage = gameState.board.activePage;
  const draftText = announcementDraft ?? gameState.announcement.text ?? '';
  const isAnnouncementOnBoard = boardPage === BOARD_PAGES.ANNOUNCEMENT && Boolean(gameState.announcement.visible);

  const handleConfirmReset = () => {
    controller.resetGame();
    setResetConfirmOpen(false);
  };

  const pushAnnouncementToBoard = (text, visible) => {
    controller.updateAnnouncement(gameState.announcement.title || '', text, visible);
    controller.changePage(visible ? BOARD_PAGES.ANNOUNCEMENT : BOARD_PAGES.SCOREBOARD);
  };

  const handleAnnouncementToggle = () => {
    if (isAnnouncementOnBoard) {
      pushAnnouncementToBoard(gameState.announcement.text || '', false);
      return;
    }

    const text = draftText.trim();
    if (!text) return;

    pushAnnouncementToBoard(text, true);
  };

  const handleAnnouncementDraftChange = (value) => {
    setAnnouncementDraft(value);

    if (isAnnouncementOnBoard && !value.trim()) {
      pushAnnouncementToBoard('', false);
    }
  };

  const handlePageSelect = (page) => {
    if (page === BOARD_PAGES.ANNOUNCEMENT) {
      setAnnouncementEditing(true);
      return;
    }

    setAnnouncementEditing(false);

    if (gameState.announcement.visible) {
      controller.updateAnnouncement(
        gameState.announcement.title || '',
        gameState.announcement.text || '',
        false
      );
    }

    controller.changePage(page);
  };

  return (
    <div className="controller-shell" id="controller-root">
      <header className="controller-topbar" id="controller-topbar">
        <div className="controller-brand">
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
          <SoundToggle id="controller-sound-toggle" />

          <ConnectionStatus connected={connected} dotOnly={true} />

          <Link
            to="/activity"
            className="header-icon-link"
            title="Activity Log & Stats"
            id="header-activity-link"
          >
            <i className="bi bi-clock-history" />
            <span className="d-none d-md-inline">Activity</span>
          </Link>

          <FullscreenButton />
        </div>
      </header>

      <div className="controller-layout" id="controller-layout">
        <ControllerSidebar
          activePage={announcementEditing ? BOARD_PAGES.ANNOUNCEMENT : boardPage}
          status={gameState.status}
          timerSeconds={gameState.timer.seconds}
          isTimerRunning={gameState.timer.running}
          onPageChange={handlePageSelect}
          onStatusChange={controller.updateStatus}
          onOpenTimerModal={() => setTimerModalOpen(true)}
          onOpenThemeModal={() => setThemeModalOpen(true)}
          onOpenPermissionsModal={() => setPermissionsModalOpen(true)}
          onOpenQuestionModal={() => setQuestionModalOpen(true)}
          onOpenStatsModal={() => setStatsModalOpen(true)}
        />

        <main className="controller-main" id="controller-main-content">
          <div className="controller-page-heading">
            <div className="control-room-header">
              <div className="eyebrow">CONTROL ROOM</div>
            </div>

            <QuickActions
              onLive={() => controller.updateStatus('LIVE')}
              onPause={() => controller.updateStatus('PAUSED')}
              onReset={() => setResetConfirmOpen(true)}
              onUndo={controller.undo}
              onRedo={controller.redo}
              canUndo={canUndo}
              canRedo={canRedo}
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
                  <h2>{announcementEditing ? 'Announcement Control' : 'Live Screen Preview'}</h2>
                </div>

                <div className="monitor-heading-actions">
                  <button
                    type="button"
                    className="btn-link-action monitor-wheel-action-btn"
                    onClick={() => setWheelModalOpen(true)}
                    aria-label="Add text and options to the wheel"
                    title="Add text to wheel"
                    id="btn-open-wheel-config"
                  >
                    <i className="bi bi-pie-chart-fill" />
                    <span>Wheel Text</span>
                  </button>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={() => setThemeModalOpen(true)}
                    aria-label="Edit board theme"
                  >
                    <i className="bi bi-palette" /> Edit Theme
                  </button>
                </div>
              </div>

              {announcementEditing ? (
                <AnnouncementControl
                  gameState={gameState}
                  draftText={draftText}
                  onDraftChange={handleAnnouncementDraftChange}
                  isOnBoard={isAnnouncementOnBoard}
                  onToggle={handleAnnouncementToggle}
                />
              ) : (
                <BoardPreview gameState={gameState} />
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Timer Config Modal */}
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

      {/* Theme Modal */}
      <Modal
        open={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        title="BOARD THEME SELECTION"
        size="medium"
        footer={
          <Button
            variant="primary"
            size="medium"
            onClick={() => setThemeModalOpen(false)}
            id="btn-close-theme-modal"
          >
            <i className="bi bi-check2" />
            <span>Done</span>
          </Button>
        }
      >
        <ThemeEditor
          currentTheme={gameState.board.theme}
          onChange={(newTheme) => {
            controller.updateTheme(newTheme);
            setThemeModalOpen(false);
          }}
        />
      </Modal>

      {/* Wheel Config Modal */}
      <WheelConfigModal
        open={wheelModalOpen}
        onClose={() => setWheelModalOpen(false)}
        currentEntries={gameState.wheel.entries}
        onSave={(entries) => controller.setWheel(entries)}
      />

      {/* Host Permissions Modal */}
      <HostPermissionsModal
        open={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        permissions={gameState.hostPermissions}
        onUpdate={controller.updateHostPermissions}
      />

      {/* Question Manager Modal */}
      <QuestionManagerModal
        open={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        currentQuestion={gameState.question?.current}
        questionStatus={gameState.question?.status}
        questionHistory={gameState.question?.history}
        onSetQuestion={controller.setQuestion}
        onShowQuestion={controller.showQuestion}
        onRevealAnswer={controller.revealAnswer}
        onMarkQuestion={controller.markQuestion}
        onClearQuestion={controller.clearQuestion}
        onChangePage={controller.changePage}
      />

      {/* Game Statistics Modal */}
      <GameStatsModal
        open={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        gameState={gameState}
      />

      {/* Reset Confirmation Modal */}
      <Modal
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title="RESET GAME CONFIRMATION"
        size="medium"
        footer={
          <>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setResetConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="medium"
              onClick={handleConfirmReset}
              id="btn-confirm-game-reset"
            >
              <i className="bi bi-trash" />
              <span>Confirm Reset</span>
            </Button>
          </>
        }
      >
        <div className="reset-confirm-modal-body">
          <div className="reset-confirm-icon">
            <i className="bi bi-exclamation-triangle-fill text-danger" />
          </div>
          <p className="reset-confirm-text">
            Are you sure you want to reset the game? This will reset all team scores, rounds, question history, and board status back to initial factory values.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default ControllerPage;
