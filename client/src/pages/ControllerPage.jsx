import { useEffect, useState } from 'react';

import { GAME_EVENTS } from '../constants/gameEvents';

import { useGameState } from '../hooks/useGameState';

import { useController } from '../hooks/useController';

import ControllerSidebar from '../components/controller/ControllerSidebar';
import ScoreControls from '../components/controller/ScoreControls';
import TeamConfig from '../components/controller/TeamConfig';
import QuickActions from '../components/controller/QuickActions';
import BoardDirector from '../components/controller/BoardDirector';
import BoardPreview from '../components/controller/BoardPreview';
import ThemeEditor from '../components/controller/ThemeEditor';
import ActivityLog from '../components/controller/ActivityLog';

function ControllerPage() {
  const {
    socket,
    connected,
    gameState
  } = useGameState();

  const controller = useController(socket);

  const [
    activities,
    setActivities
  ] = useState([]);

  useEffect(() => {
    if (!gameState?.meta?.lastAction) {
      return;
    }

    const entry = {
      id:
        gameState.meta.lastActionAt ||
        Date.now(),

      message:
        gameState.meta.lastAction,

      time: new Date(
        gameState.meta.lastActionAt ||
        Date.now()
      ).toLocaleTimeString()
    };

    setActivities(
      (current) => [
        entry,
        ...current
      ].slice(0, 15)
    );
  }, [
    gameState?.meta?.lastAction,
    gameState?.meta?.lastActionAt
  ]);

  if (!gameState) {
    return (
      <div className="controller-loading">
        <strong>RBP</strong>
        <span>
          Connecting to game server...
        </span>
      </div>
    );
  }

  const handleReset = () => {
    controller.resetGame();
  };

  return (
    <div className="controller-shell">

      <header className="controller-topbar">

        <div className="controller-brand">

          <div className="controller-logo">
            RBP
          </div>

          <div>
            <div className="controller-title">
              RALLY BOARD PILOT
            </div>

            <div className="controller-subtitle">
              GAME CONTROL
            </div>
          </div>

        </div>

        <div className="controller-status">

          <span
            className={
              connected ? 'controller-status-dot online' : 'controller-status-dot offline'
            }
          />

          {connected ? 'SERVER CONNECTED' : 'SERVER OFFLINE'}

        </div>

      </header>

      <div className="controller-layout">

        <ControllerSidebar
          activePage={
            gameState.board.activePage
          }
          status={
            gameState.status
          }
          onPageChange={
            controller.changePage
          }
          onStatusChange={
            controller.updateStatus
          }
        />

        <main className="controller-main">

          <div className="controller-page-heading">

            <div>
              <div className="eyebrow">
                CONTROL ROOM
              </div>

              <h1>
                Live Game Control
              </h1>

              <p>
                Direct the game board live
              </p>
            </div>

            <BoardDirector
              activePage={
                gameState.board.activePage
              }
              status={
                gameState.status
              }
            />

          </div>

          <QuickActions
            onLive={() =>
              controller.updateStatus('LIVE')
            }
            onPause={() =>
              controller.updateStatus('PAUSED')
            }
            onReset={handleReset}
          />

          <section className="control-grid">

            <ScoreControls
              team="A"
              teamData={
                gameState.teams.A
              }
              onAdd={
                controller.addScore
              }
              onSubtract={
                controller.subtractScore
              }
            />

            <ScoreControls
              team="B"
              teamData={
                gameState.teams.B
              }
              onAdd={
                controller.addScore
              }
              onSubtract={
                controller.subtractScore
              }
            />

          </section>

          <section className="wide-control-card">

            <div className="wide-card-heading">
              <div>
                <div className="eyebrow">
                  TEAM SETUP
                </div>

                <h2>
                  Team Configuration
                </h2>
              </div>
            </div>

            <div className="team-config-grid">

              <TeamConfig
                team="A"
                teamData={
                  gameState.teams.A
                }
                onUpdate={
                  controller.updateTeam
                }
              />

              <TeamConfig
                team="B"
                teamData={
                  gameState.teams.B
                }
                onUpdate={
                  controller.updateTeam
                }
              />

            </div>

          </section>

          <section className="wide-control-card">

            <div className="wide-card-heading">

              <div>
                <div className="eyebrow">
                  ROUND DIRECTOR
                </div>

                <h2>
                  Round Configuration
                </h2>
              </div>

              <div className="round-live-number">
                ROUND {gameState.round.number}
              </div>

            </div>

            <div className="round-controls">

              <div className="field">

                <label>
                  Round Number
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    gameState.round.number
                  }
                  onChange={(event) =>
                    controller.updateRound(
                      Number(
                        event.target.value
                      ),
                      gameState.round.name
                    )
                  }
                />

              </div>

              <div className="field">

                <label>
                  Round Name
                </label>

                <input
                  value={
                    gameState.round.name
                  }
                  onChange={(event) =>
                    controller.updateRound(
                      gameState.round.number,
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="round-display-value">
                {gameState.round.name}
              </div>

            </div>

          </section>

          <ThemeEditor
            currentTheme={
              gameState.board.theme
            }
            onChange={
              controller.updateTheme
            }
          />

          <BoardPreview
            gameState={gameState}
          />

          <ActivityLog
            activities={activities}
          />

        </main>

      </div>

    </div>
  );
}

export default ControllerPage;
