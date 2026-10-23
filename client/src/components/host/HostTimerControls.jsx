import Button from '../common/Button';
import { formatTime } from '../../utils/formatScore';

const TIMER_ADJUST_STEPS = [-5, -1, 1, 5];

function HostTimerControls({
  gameState,
  onStart,
  onPause,
  onReset,
  onSetTimer,
  onPage
}) {
  const timer = gameState.timer;
  const isTimerPage = gameState.board.activePage === 'timer';

  const handleStep = (step) => {
    if (typeof onSetTimer === 'function') {
      const nextVal = Math.max(0, Math.min(180, timer.seconds + step));
      onSetTimer(nextVal);
    }
  };

  return (
    <section className="host-panel host-timer-card-panel" id="host-timer-panel">
      <div className="host-panel-header-row">
        <div>
          <small className="host-panel-eyebrow">GAME CLOCK (SYNCHRONIZED)</small>
          <div className="host-timer-readout">
            <span className="host-timer-digits">{formatTime(timer.seconds)}</span>
            <span className={`host-timer-badge ${timer.running ? 'badge-running' : 'badge-stopped'}`}>
              {timer.running ? 'RUNNING' : 'STOPPED'}
            </span>
          </div>
        </div>

        <Button
          variant={isTimerPage ? 'primary' : 'secondary'}
          size="small"
          onClick={() => onPage('timer')}
        >
          <i className="bi bi-display me-1" />
          <span>SHOW ON BOARD</span>
        </Button>
      </div>

      <div className="host-timer-body-grid">
        <div className="host-timer-adjust-column">
          <small className="host-field-caption">TIME ADJUST (SEC)</small>
          <div className="host-square-2x2-grid" role="group" aria-label="Timer Adjustment Buttons">
            {TIMER_ADJUST_STEPS.map((step) => {
              const isMinus = step < 0;
              return (
                <Button
                  key={step}
                  variant={isMinus ? 'score-minus' : 'score-plus'}
                  size="small"
                  className="host-sq-step-btn"
                  onClick={() => handleStep(step)}
                  aria-label={`${isMinus ? 'Subtract' : 'Add'} ${Math.abs(step)} seconds`}
                >
                  {isMinus ? `−${Math.abs(step)}` : `+${step}`}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="host-timer-actions-column">
          <small className="host-field-caption">CLOCK CONTROL</small>
          <div className="host-timer-action-buttons">
            {timer.running ? (
              <Button
                variant="warning"
                size="small"
                onClick={onPause}
                id="btn-host-pause-timer"
                className="w-100"
              >
                <i className="bi bi-pause-fill me-1" />
                <span>PAUSE</span>
                <span className="rbp-shortcut-badge">CTRL + Space</span>
              </Button>
            ) : (
              <Button
                variant="success"
                size="small"
                onClick={onStart}
                id="btn-host-start-timer"
                className="w-100"
              >
                <i className="bi bi-play-fill me-1" />
                <span>START</span>
                <span className="rbp-shortcut-badge">CTRL + Space</span>
              </Button>
            )}

            <Button
              variant="secondary"
              size="small"
              onClick={onReset}
              id="btn-host-reset-timer"
              className="w-100"
            >
              <i className="bi bi-arrow-counterclockwise me-1" />
              <span>RESET</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HostTimerControls;
