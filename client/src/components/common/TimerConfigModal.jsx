import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Tooltip from './Tooltip';
import { GAME_CONFIG } from '../../config/gameConfig';
import { formatTime } from '../../utils/formatScore';

const DECREASE_STEPS = [-1, -2, -5, -10];
const INCREASE_STEPS = [1, 2, 5, 10];

function TimerConfigModal({
  open,
  onClose,
  currentSeconds = 30,
  onSetTimer,
  onStart,
  onPause,
  onReset,
  isRunning = false
}) {
  const [seconds, setSeconds] = useState(currentSeconds);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setSeconds(currentSeconds);
  }, [currentSeconds, open]);

  const handleApply = (value) => {
    const val = Math.floor(Number(value));

    if (!Number.isFinite(val) || val < 0) {
      setErrorMsg('Enter a whole number of seconds, 0 or higher.');
      return;
    }

    if (val > GAME_CONFIG.maxTimerSeconds) {
      setErrorMsg(`Maximum duration is ${GAME_CONFIG.maxTimerSeconds} seconds (3 minutes).`);
      return;
    }

    setErrorMsg('');
    setSeconds(val);
    onSetTimer(val);
  };

  const handleStep = (step) => {
    const nextVal = Math.max(0, Math.min(GAME_CONFIG.maxTimerSeconds, seconds + step));
    handleApply(nextVal);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="TIMER CONFIGURATION"
      size="medium"
      footer={
        <div className="tcm-footer">
          <div className="tcm-transport">
            {isRunning ? (
              <Tooltip content="Pause Timer (CTRL + Space)">
                <span>
                  <Button variant="warning" size="small" onClick={onPause}>
                    <i className="bi bi-pause-fill" aria-hidden="true" />
                    <span>PAUSE</span>
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Tooltip content="Start Timer (CTRL + Space)">
                <span>
                  <Button variant="success" size="small" onClick={onStart}>
                    <i className="bi bi-play-fill" aria-hidden="true" />
                    <span>START</span>
                  </Button>
                </span>
              </Tooltip>
            )}

            <Tooltip content="Reset Timer">
              <span>
                <Button variant="secondary" size="small" onClick={onReset}>
                  <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                  <span>RESET</span>
                </Button>
              </span>
            </Tooltip>
          </div>

          <Button variant="primary" size="small" onClick={onClose}>
            DONE
          </Button>
        </div>
      }
    >
      <div className="tcm">
        <div className="tcm-display">
          <div>
            <span className="tcm-label">CONFIGURED DURATION</span>
            <div className="tcm-readout">
              <span className="tcm-readout-time">{formatTime(seconds)}</span>
              <span className="tcm-readout-unit">{seconds}s</span>
            </div>
          </div>

          <div className="tcm-limit">
            <span className="tcm-label">LIMIT</span>
            <span className="tcm-limit-value">{GAME_CONFIG.maxTimerSeconds}s (3 min)</span>
          </div>
        </div>

        {errorMsg && (
          <div className="tcm-error" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="tcm-grid">
          <div className="tcm-field">
            <span className="tcm-label">QUICK PRESETS</span>
            <div className="tcm-presets">
              {GAME_CONFIG.timerPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`tcm-chip ${seconds === preset ? 'is-active' : ''}`}
                  onClick={() => handleApply(preset)}
                >
                  {preset >= 60 ? `${preset / 60}m` : `${preset}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="tcm-field">
            <label htmlFor="tcm-custom-seconds" className="tcm-label">
              CUSTOM SECONDS (0 - {GAME_CONFIG.maxTimerSeconds})
            </label>
            <div className="tcm-input-wrap">
              <input
                id="tcm-custom-seconds"
                type="number"
                min="0"
                max={GAME_CONFIG.maxTimerSeconds}
                value={seconds}
                onChange={(event) => handleApply(event.target.value)}
                className="tcm-input"
              />
              <span className="tcm-input-unit">sec</span>
            </div>
          </div>
        </div>

        <div className="tcm-grid">
          <div className="tcm-field">
            <span className="tcm-label">DECREASE</span>
            <div className="tcm-steps" role="group" aria-label="Decrease timer">
              {DECREASE_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  className="tcm-step is-minus"
                  onClick={() => handleStep(step)}
                  aria-label={`Subtract ${Math.abs(step)} seconds`}
                >
                  −{Math.abs(step)}
                </button>
              ))}
            </div>
          </div>

          <div className="tcm-field">
            <span className="tcm-label">INCREASE</span>
            <div className="tcm-steps" role="group" aria-label="Increase timer">
              {INCREASE_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  className="tcm-step is-plus"
                  onClick={() => handleStep(step)}
                  aria-label={`Add ${step} seconds`}
                >
                  +{step}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TimerConfigModal;
