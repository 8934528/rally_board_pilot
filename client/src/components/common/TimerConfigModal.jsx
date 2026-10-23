import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { GAME_CONFIG } from '../../config/gameConfig';
import { formatTime } from '../../utils/formatScore';

const TIME_STEPS = [-10, -5, -2, -1, 1, 2, 5, 10];

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
              <Button variant="warning" onClick={onPause} size="small">
                <i className="bi bi-pause-fill" /> PAUSE
              </Button>
            ) : (
              <Button variant="success" onClick={onStart} size="small">
                <i className="bi bi-play-fill" /> START
              </Button>
            )}
            <Button variant="secondary" onClick={onReset} size="small">
              <i className="bi bi-arrow-counterclockwise" /> RESET
            </Button>
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

        <div className="timer-adjust-section">
          <span className="panel-sublabel">STEP ADJUSTMENT (SECONDS)</span>
          <div className="timer-steps-grid">
            {TIME_STEPS.map((step) => {
              const isMinus = step < 0;
              return (
                <button
                  key={step}
                  type="button"
                  className={`timer-step-btn ${isMinus ? 'step-minus' : 'step-plus'}`}
                  onClick={() => handleStep(step)}
                >
                  {isMinus ? step : `+${step}`}
                </button>
              );
            })}
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
