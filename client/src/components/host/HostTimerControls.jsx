import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import { formatTime } from '../../utils/formatScore';
import { useGame } from '../../context/GameContext';

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
  const { hasHostPermission } = useGame();
  const canTimer = hasHostPermission('timer');
  const canStatus = hasHostPermission('status');

  const timer = gameState.timer;
  const isTimerPage = gameState.board.activePage === 'timer';

  const handleStep = (step) => {
    if (!canTimer || typeof onSetTimer !== 'function') {
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

        <Tooltip content={canStatus ? 'Show Game Clock on Board' : 'Page switching restricted by Controller'}>
          <span>
            <Button
              variant={isTimerPage ? 'primary' : 'secondary'}
              size="small"
              onClick={() => canStatus && onPage('timer')}
              disabled={!canStatus}
              aria-label="Show Game Clock on Board"
            >
              <i className="bi bi-display" aria-hidden="true" />
            </Button>
          </span>
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
              const btn = (
                <Button
                  key={step}
                  variant={isMinus ? 'score-minus' : 'score-plus'}
                  size="small"
                  className="host-sq-step-btn"
                  disabled={!canTimer}
                  onClick={() => handleStep(step)}
                  aria-label={`${isMinus ? 'Subtract' : 'Add'} ${amount} seconds`}
                >
                  {isMinus ? `−${amount}` : `+${amount}`}
                </Button>
              );

              if (!canTimer) {
                return (
                  <Tooltip key={step} content="Timer adjustment restricted by Controller">
                    <span>{btn}</span>
                  </Tooltip>
                );
              }

              return btn;
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
                !canTimer
                  ? 'Timer control restricted by Controller'
                  : timer.running
                  ? 'Pause (CTRL + Space)'
                  : 'Start (CTRL + Space)'
              }
            >
              <span>
                <button
                  type="button"
                  className={`rbp-icon-btn rbp-icon-btn-small ${
                    timer.running ? 'rbp-button-warning' : 'rbp-button-success'
                  }`}
                  disabled={!canTimer}
                  onClick={() => {
                    if (!canTimer) return;
                    if (timer.running) onPause();
                    else onStart();
                  }}
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
              </span>
            </Tooltip>

            <Tooltip content={!canTimer ? 'Timer reset restricted by Controller' : 'Reset Timer (CTRL + R)'}>
              <span>
                <button
                  type="button"
                  className="rbp-icon-btn rbp-icon-btn-small rbp-button-secondary"
                  disabled={!canTimer}
                  onClick={() => canTimer && onReset()}
                  id="btn-host-reset-timer"
                  aria-label="Reset Timer"
                >
                  <i
                    className="bi bi-arrow-counterclockwise"
                    aria-hidden="true"
                  />
                </button>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HostTimerControls;
