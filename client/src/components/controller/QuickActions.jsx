import Button from '../common/Button';

function QuickActions({
  onLive,
  onPause,
  onReset,
  status
}) {
  return (
    <div className="quick-actions-bar" role="group" aria-label="Game Control Actions">
      <Button
        id="btn-quick-live"
        variant={status === 'LIVE' ? 'success' : 'secondary'}
        size="small"
        className={`quick-action-btn ${status === 'LIVE' ? 'active-live' : ''}`}
        onClick={onLive}
      >
        <i className="bi bi-broadcast" />
        <span>GO LIVE</span>
        <span className="rbp-shortcut-badge">L</span>
      </Button>

      <Button
        id="btn-quick-pause"
        variant={status === 'PAUSED' ? 'warning' : 'secondary'}
        size="small"
        className={`quick-action-btn ${status === 'PAUSED' ? 'active-pause' : ''}`}
        onClick={onPause}
      >
        <i className="bi bi-pause-circle" />
        <span>PAUSE</span>
        <span className="rbp-shortcut-badge">P</span>
      </Button>

      <Button
        id="btn-quick-reset"
        variant="danger"
        size="small"
        className="quick-action-btn"
        onClick={onReset}
      >
        <i className="bi bi-arrow-counterclockwise" />
        <span>RESET</span>
        <span className="rbp-shortcut-badge">R</span>
      </Button>
    </div>
  );
}

export default QuickActions;
