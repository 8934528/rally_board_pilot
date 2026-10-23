function BoardDirector({
  activePage = 'scoreboard',
  status = 'READY'
}) {
  const isLive = status === 'LIVE';

  return (
    <div className="header-status-strip" role="status" aria-label="Live Game Status">
      <div className={`director-badge-live ${isLive ? 'on-air' : 'off-air'}`}>
        <span className={`director-dot ${isLive ? 'pulse' : ''}`} />
        <span>ON AIR</span>
      </div>

      <div className="director-badge-page" title="Current Active Board Page">
        <i className="bi bi-display" aria-hidden="true" />
        <span>{activePage.toUpperCase()}</span>
      </div>

      <div className={`director-badge-status status-${status.toLowerCase()}`}>
        <span>{status}</span>
      </div>
    </div>
  );
}

export default BoardDirector;
