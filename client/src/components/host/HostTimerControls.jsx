import Button from '../common/Button';
import { formatTime } from '../../utils/formatScore';

function HostTimerControls({
  gameState,
  onStart,
  onPause,
  onReset,
  onPage
}) {
  const timer = gameState.timer;
  const isTimerPage = gameState.board.activePage === 'timer';

  return (
    <section className="host-panel host-timer-panel" id="host-timer-panel">
      <div className="host-timer-info">
        <small className="host-panel-eyebrow">GAME CLOCK (SYNCHRONIZED)</small>
        <div className="host-timer-readout">
          <span className="host-timer-digits">{formatTime(timer.seconds)}</span>
          <span className={`host-timer-badge ${timer.running ? 'badge-running' : 'badge-stopped'}`}>
            {timer.running ? 'RUNNING' : 'STOPPED'}
          </span>
        </div>
      </div>

      <div className="host-panel-actions">
        <Button
          variant={isTimerPage ? 'primary' : 'secondary'}
          size="small"
          onClick={() => onPage('timer')}
        >
          <i className="bi bi-display" />
          <span>SHOW ON BOARD</span>
        </Button>

        {timer.running ? (
          <Button
            variant="warning"
            size="small"
            onClick={onPause}
            id="btn-host-pause-timer"
          >
            <i className="bi bi-pause-fill" />
            <span>PAUSE</span>
            <span className="rbp-shortcut-badge">Space</span>
          </Button>
        ) : (
          <Button
            variant="success"
            size="small"
            onClick={onStart}
            id="btn-host-start-timer"
          >
            <i className="bi bi-play-fill" />
            <span>START</span>
            <span className="rbp-shortcut-badge">Space</span>
          </Button>
        )}

        <Button
          variant="secondary"
          size="small"
          onClick={onReset}
          id="btn-host-reset-timer"
        >
          <i className="bi bi-arrow-counterclockwise" />
          <span>RESET</span>
        </Button>
      </div>
    </section>
  );
}

export default HostTimerControls;
