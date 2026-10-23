import Button from '../common/Button';

function HostControls({
  onLive,
  onPause,
  onPage,
  status,
  activePage
}) {
  return (
    <div
      className="host-controls items-end d-flex justify-content-end"
      role="group"
      aria-label="Host primary game controls"
    >
      <Button
        variant={status === 'LIVE' ? 'success' : 'secondary'}
        size="small"
        onClick={onLive}
        id="btn-host-live"
      >
        <i className="bi bi-broadcast" />
        <span>GO LIVE</span>
        <span className="rbp-shortcut-badge">CTRL + L</span>
      </Button>

      <Button
        variant={status === 'PAUSED' ? 'warning' : 'secondary'}
        size="small"
        onClick={onPause}
        id="btn-host-pause"
      >
        <i className="bi bi-pause-circle" />
        <span>PAUSE</span>
        <span className="rbp-shortcut-badge">CTRL + P</span>
      </Button>

      <Button
        variant={activePage === 'scoreboard' ? 'primary' : 'secondary'}
        size="small"
        onClick={() => onPage('scoreboard')}
        id="btn-host-show-scoreboard"
      >
        <i className="bi bi-trophy" />
        <span>SCOREBOARD</span>
      </Button>
    </div>
  );
}

export default HostControls;
