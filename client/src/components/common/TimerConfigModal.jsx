import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Tooltip from './Tooltip';
import { GAME_CONFIG } from '../../config/gameConfig';
import { formatTime } from '../../utils/formatScore';

const NEGATIVE_STEPS = [-1, -2, -5, -10];
const POSITIVE_STEPS = [1, 2, 5, 10];

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

  const handleApply = (newSecs) => {
    const val = Math.floor(Number(newSecs));
    if (!Number.isFinite(val) || val < 0) {
      setErrorMsg('Please enter a valid positive number');
      return;
    }
    if (val > GAME_CONFIG.maxTimerSeconds) {
      setErrorMsg(`Maximum duration is 3 minutes (${GAME_CONFIG.maxTimerSeconds}s)`);
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
        <div className="timer-modal-footer">
          <div className="timer-actions-group">
            {isRunning ? (
              <Tooltip content="Pause Timer (CTRL + Space)">
                <button
                  type="button"
                  className="rbp-icon-btn rbp-icon-btn-medium rbp-button-warning"
                  onClick={onPause}
                  aria-label="Pause Timer"
                >
                  <i className="bi bi-pause-fill" aria-hidden="true" />
                </button>
              </Tooltip>
            ) : (
              <Tooltip content="Start Timer (CTRL + Space)">
                <button
                  type="button"
                  className="rbp-icon-btn rbp-icon-btn-medium rbp-button-success"
                  onClick={onStart}
                  aria-label="Start Timer"
                >
                  <i className="bi bi-play-fill" aria-hidden="true" />
                </button>
              </Tooltip>
            )}

            <Tooltip content="Reset Timer">
              <button
                type="button"
                className="rbp-icon-btn rbp-icon-btn-medium rbp-button-secondary"
                onClick={onReset}
                aria-label="Reset Timer"
              >
                <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
              </button>
            </Tooltip>
          </div>

          <Button variant="primary" onClick={onClose} size="small">
            DONE
          </Button>
        </div>
      }
    >
      <div className="timer-config-panel">
        <div className="timer-preview-card">
          <span className="timer-panel-label">CONFIGURED DURATION</span>
          <div className="timer-large-display">
            {formatTime(seconds)}
            <span className="timer-seconds-unit">{seconds}s</span>
          </div>
          <span className="timer-limit-hint">Maximum limit: 3 minutes (180s)</span>
        </div>

        {errorMsg && <div className="timer-error-banner">{errorMsg}</div>}

        <div className="timer-presets-section">
          <span className="panel-sublabel">QUICK PRESETS</span>
          <div className="timer-presets-grid">
            {GAME_CONFIG.timerPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`timer-preset-btn ${seconds === preset ? 'active' : ''}`}
                onClick={() => handleApply(preset)}
              >
                {preset >= 60 ? `${preset / 60}m` : `${preset}s`}
              </button>
            ))}
          </div>
        </div>

        <div className="timer-adjust-row">
          <div className="timer-adjust-col">
            <span className="panel-sublabel">DECREASE</span>
            <div className="timer-square-grid" role="group" aria-label="Decrease Timer">
              {NEGATIVE_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  className="timer-square-step-btn step-minus"
                  onClick={() => handleStep(step)}
                  aria-label={`Subtract ${Math.abs(step)} seconds`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>


          <div className="timer-adjust-col">
            <span className="panel-sublabel">INCREASE</span>
            <div className="timer-square-grid" role="group" aria-label="Increase Timer">
              {POSITIVE_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  className="timer-square-step-btn step-plus"
                  onClick={() => handleStep(step)}
                  aria-label={`Add ${step} seconds`}
                >
                  +{step}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="timer-custom-input-row">
          <label htmlFor="customSecondsInput" className="panel-sublabel">
            CUSTOM SECONDS (0 - 180)
          </label>
          <div className="custom-input-wrap">
            <input
              id="customSecondsInput"
              type="number"
              min="0"
              max="180"
              value={seconds}
              onChange={(e) => handleApply(e.target.value)}
              className="timer-number-input"
            />
            <span className="input-unit">sec</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TimerConfigModal;
