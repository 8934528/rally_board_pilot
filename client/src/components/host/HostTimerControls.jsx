import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import { formatTime } from '../../utils/formatScore';

const TIMER_ADJUST_STEPS = [
  -5,
  -1,
  1,
  5
];

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
    if (typeof onSetTimer !== 'function') {
      return;
    }

    const nextVal = Math.max(
      0,
      Math.min(180, timer.seconds + step)
    );

    onSetTimer(nextVal);
  };

  return (
    <section
      className="host-panel host-timer-card-panel"
      id="host-timer-panel"
    >
      <div className="host-timer-main-row">
        <div className="host-timer-display-block">
          <small className="host-panel-eyebrow">
            GAME CLOCK
          </small>

          <div className="host-timer-readout">
            <span className="host-timer-digits">
              {formatTime(timer.seconds)}
            </span>

            <span
              className={`host-timer-badge ${
                timer.running ? 'badge-running' : 'badge-stopped'
              }`}
            >
              {timer.running ? 'RUNNING' : 'STOPPED'}
            </span>
          </div>
        </div>

        <Tooltip content="Show Game Clock on Board">
          <Button
            variant={isTimerPage ? 'primary' : 'secondary'}
            size="small"
            onClick={() => onPage('timer')}
            aria-label="Show Game Clock on Board"
          >
            <i className="bi bi-display" aria-hidden="true" />
          </Button>
        </Tooltip>
      </div>

      <div className="host-timer-controls-row">
        <div className="host-timer-control-group">
          <small className="host-field-caption">
            TIME ADJUST
          </small>

          <div
            className="host-square-2x2-grid"
            role="group"
            aria-label="Timer Adjustment Buttons"
          >
            {TIMER_ADJUST_STEPS.map((step) => {
              const isMinus = step < 0;
              const amount = Math.abs(step);

              return (
                <Button
                  key={step}
                  variant={isMinus ? 'score-minus' : 'score-plus'}
                  size="small"
                  className="host-sq-step-btn"
                  onClick={() => handleStep(step)}
                  aria-label={`${isMinus ? 'Subtract' : 'Add'} ${amount} seconds`}
                >
                  {isMinus ? `−${amount}` : `+${amount}`}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="host-timer-control-group host-timer-clock-control">
          <small className="host-field-caption">
            CLOCK CONTROL
          </small>

          <div className="host-timer-action-buttons">
            <Tooltip
              content={
                timer.running ? 'Pause (CTRL + Space)' : 'Start (CTRL + Space)'
              }
            >
              <button
                type="button"
                className={`rbp-icon-btn rbp-icon-btn-small ${
                  timer.running ? 'rbp-button-warning' : 'rbp-button-success'
                }`}
                onClick={timer.running ? onPause : onStart}
                id={
                  timer.running ? 'btn-host-pause-timer' : 'btn-host-start-timer'
                }
                aria-label={timer.running ? 'Pause' : 'Start'}
              >
                <i
                  className={
                    timer.running ? 'bi bi-pause-fill' : 'bi bi-play-fill'
                  }
                  aria-hidden="true"
                />
              </button>
            </Tooltip>

            <Tooltip content="Reset Timer (CTRL + R)">
              <button
                type="button"
                className="rbp-icon-btn rbp-icon-btn-small rbp-button-secondary"
                onClick={onReset}
                id="btn-host-reset-timer"
                aria-label="Reset Timer"
              >
                <i
                  className="bi bi-arrow-counterclockwise"
                  aria-hidden="true"
                />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HostTimerControls;
