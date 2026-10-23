import { useGameState } from '../hooks/useGameState';
import { useHost } from '../hooks/useHost';

import HostControls from '../components/host/HostControls';
import HostRoundControls from '../components/host/HostRoundControls';
import HostScorePanel from '../components/host/HostScorePanel';
import HostWheelControls from '../components/host/HostWheelControls';

function HostPage() {
  const {
    socket,
    connected,
    gameState
  } = useGameState();

  const host = useHost(socket);

  if (!gameState) {
    return (
      <div className="host-loading">
        Connecting...
      </div>
    );
  }

  return (
    <main className="host-shell">

      <header className="host-topbar">

        <div>
          <div className="host-title">
            RALLY BOARD PILOT
          </div>

          <div className="host-subtitle">
            HOST CONTROL
          </div>
        </div>

        <div className="host-connection">
          <span
            className={
              connected
                ? 'connection-dot online'
                : 'connection-dot offline'
            }
          />

          {connected
            ? 'CONNECTED'
            : 'OFFLINE'}
        </div>

      </header>

      <main className="host-main">

        <HostControls
          onLive={() =>
            host.updateStatus('LIVE')
          }
          onPause={() =>
            host.updateStatus('PAUSED')
          }
          onPage={host.changePage}
        />

        <HostScorePanel
          gameState={gameState}
          onAdd={host.addScore}
          onSubtract={host.subtractScore}
        />

        <HostRoundControls
          gameState={gameState}
          onRound={host.updateRound}
        />

        <HostWheelControls
          onPage={host.changePage}
          onSpin={host.spinWheel}
        />

      </main>

    </main>
  );
}

export default HostPage;