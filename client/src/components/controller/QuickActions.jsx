import Tooltip from '../common/Tooltip';

function QuickActions({
  onLive,
  onPause,
  onReset,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  status
}) {
  const isLive = status === 'LIVE';
  const isPaused = status === 'PAUSED';

  return (
    <div
      className="quick-actions-bar"
      role="group"
      aria-label="Game Control Actions"
    >
      {/* Undo Button */}
      <Tooltip content={canUndo ? 'Undo' : 'Nothing to undo'}>
        <span>
          <button
            type="button"
            id="btn-quick-undo"
            className="rbp-icon-btn rbp-icon-btn-small rbp-button-secondary"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
          >
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
          </button>
        </span>
      </Tooltip>

      {/* Redo Button */}
      <Tooltip content={canRedo ? 'Redo' : 'Nothing to redo'}>
        <span>
          <button
            type="button"
            id="btn-quick-redo"
            className="rbp-icon-btn rbp-icon-btn-small rbp-button-secondary"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
          >
            <i className="bi bi-arrow-clockwise" aria-hidden="true" />
          </button>
        </span>
      </Tooltip>

      <div className="quick-actions-divider" />

      {/* Live Button */}
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

      {/* Pause Button */}
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

      {/* Reset Game Button */}
      <Tooltip content="Reset Game">
        <button
          type="button"
          id="btn-quick-reset"
          className="rbp-icon-btn rbp-icon-btn-small rbp-button-danger"
          onClick={onReset}
          aria-label="Reset Game"
        >
          <i className="bi bi-trash" aria-hidden="true" />
        </button>
      </Tooltip>
    </div>
  );
}

export default QuickActions;
