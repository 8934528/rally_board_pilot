import Tooltip from '../common/Tooltip';

function QuickActions({
  onLive,
  onPause,
  onReset,
  status
}) {
  const isLive = status === 'LIVE';
  const isPaused = status === 'PAUSED';

  return (
    <div className="quick-actions-bar" role="group" aria-label="Game Control Actions">
      
      <Tooltip content="Go Live (CTRL + L)">
        <button
          type="button"
          id="btn-quick-live"
          className={`rbp-icon-btn rbp-icon-btn-small ${
            isLive ? 'rbp-button-success active-live' : 'rbp-button-secondary'
          }`}
          onClick={onLive}
          aria-label="Go Live"
          aria-pressed={isLive}
        >
          <i className="bi bi-broadcast" aria-hidden="true" />
        </button>
      </Tooltip>



      <Tooltip content="Pause (CTRL + P)">
        <button
          type="button"
          id="btn-quick-pause"
          className={`rbp-icon-btn rbp-icon-btn-small ${
            isPaused ? 'rbp-button-warning active-pause' : 'rbp-button-secondary'
          }`}
          onClick={onPause}
          aria-label="Pause"
          aria-pressed={isPaused}
        >
          <i className="bi bi-pause-circle-fill" aria-hidden="true" />
        </button>
      </Tooltip>

      {/* Reset Button (Icon-only with accessible tooltip and ARIA label) */}
      <Tooltip content="Reset Game (CTRL + R)">
        <button
          type="button"
          id="btn-quick-reset"
          className="rbp-icon-btn rbp-icon-btn-small rbp-button-danger"
          onClick={onReset}
          aria-label="Reset Game"
        >
          <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
        </button>
      </Tooltip>

      <span className="quick-actions-shortcut-legend d-none d-md-inline-block">
        <span className="rbp-shortcut-badge">CTRL+L</span>
        <span className="rbp-shortcut-badge">CTRL+P</span>
        <span className="rbp-shortcut-badge">CTRL+R</span>
      </span>
    </div>
  );
}

export default QuickActions;
