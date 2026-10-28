import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { GAME_CONFIG } from '../../config/gameConfig';
import { formatTime } from '../../utils/formatScore';

const DECREASE_STEPS = [-10, -5, -2, -1];
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
      setErrorMsg('Enter a valid whole number of seconds (0 or higher).');
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
              <Button
                variant="warning"
                size="medium"
                onClick={onPause}
                id="btn-timer-modal-pause"
              >
                <i className="bi bi-pause-fill" aria-hidden="true" />
                <span>PAUSE</span>
              </Button>
            ) : (
              <Button
                variant="success"
                size="medium"
                onClick={onStart}
                id="btn-timer-modal-start"
              >
                <i className="bi bi-play-fill" aria-hidden="true" />
                <span>START</span>
              </Button>
            )}

            <Button
              variant="secondary"
              size="medium"
              onClick={onReset}
              id="btn-timer-modal-reset"
            >
              <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
              <span>RESET</span>
            </Button>
          </div>

          <Button
            variant="primary"
            size="medium"
            onClick={onClose}
            id="btn-timer-modal-done"
          >
            <i className="bi bi-check2" />
            <span>Done</span>
          </Button>
        </div>
      }
    >
      <div className="tcm">
        <div className="tcm-hero">
          <div className="tcm-hero-main">
            <div className="tcm-status-row">
              <span className="tcm-hero-label">ACTIVE DURATION</span>
              <span className={`tcm-status-tag ${isRunning ? 'is-running' : 'is-ready'}`}>
                <span className="tcm-status-pulse" />
                {isRunning ? 'RUNNING' : seconds > 0 ? 'READY' : 'EXPIRED'}
              </span>
            </div>
            <div className="tcm-hero-readout">
              <span className="tcm-digital-clock">{formatTime(seconds)}</span>
              <span className="tcm-seconds-pill">{seconds}s</span>
            </div>
          </div>

          <div className="tcm-hero-aside">
            <div className="tcm-info-box">
              <span className="tcm-info-label">MAX LIMIT</span>
              <span className="tcm-info-val">{GAME_CONFIG.maxTimerSeconds}s (3 min)</span>
            </div>
            <div className="tcm-info-box">
              <span className="tcm-info-label">SHORTCUT</span>
              <span className="tcm-info-val">Space = Play/Pause</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="tcm-error" role="alert">
            <i className="bi bi-exclamation-circle-fill" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="tcm-group">
          <div className="tcm-group-header">
            <span className="tcm-group-title">DURATION PRESETS</span>
            <span className="tcm-group-hint">Select a common countdown duration</span>
          </div>
          <div className="tcm-presets-grid">
            {GAME_CONFIG.timerPresets.map((preset) => {
              const label = preset >= 60 ? `${preset / 60}m` : `${preset}s`;
              const sub = preset >= 60 ? `(${preset}s)` : null;
              return (
                <button
                  key={preset}
                  type="button"
                  className={`tcm-preset-btn ${seconds === preset ? 'is-active' : ''}`}
                  onClick={() => handleApply(preset)}
                >
                  <span className="tcm-preset-main">{label}</span>
                  {sub && <span className="tcm-preset-sub">{sub}</span>}
                </button>
              );
            })}
          </div>
        </div>



        <div className="tcm-adjust-grid">
          {/* Custom Input */}
          <div className="tcm-group">
            <div className="tcm-group-header">
              <label htmlFor="tcm-custom-input" className="tcm-group-title">
                CUSTOM DURATION
              </label>
              <span className="tcm-group-hint">0 to {GAME_CONFIG.maxTimerSeconds}s</span>
            </div>
            <div className="tcm-input-row">
              <input
                id="tcm-custom-input"
                type="number"
                min="0"
                max={GAME_CONFIG.maxTimerSeconds}
                value={seconds}
                onChange={(e) => handleApply(e.target.value)}
                className="tcm-custom-number-input"
              />
              <span className="tcm-custom-unit">SECONDS</span>
            </div>
          </div>


          <div className="tcm-group">
            <div className="tcm-group-header">
              <span className="tcm-group-title">FINE-TUNE ADJUSTMENT</span>
              <span className="tcm-group-hint">Nudge timer up or down</span>
            </div>
            <div className="tcm-steppers-container">
              <div className="tcm-steppers-row" role="group" aria-label="Decrease time">
                {DECREASE_STEPS.map((step) => (
                  <button
                    key={step}
                    type="button"
                    className="tcm-step-btn is-decrease"
                    onClick={() => handleStep(step)}
                    aria-label={`Subtract ${Math.abs(step)} seconds`}
                  >
                    {step}s
                  </button>
                ))}
              </div>
              <div className="tcm-steppers-row" role="group" aria-label="Increase time">
                {INCREASE_STEPS.map((step) => (
                  <button
                    key={step}
                    type="button"
                    className="tcm-step-btn is-increase"
                    onClick={() => handleStep(step)}
                    aria-label={`Add ${step} seconds`}
                  >
                    +{step}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TimerConfigModal;
