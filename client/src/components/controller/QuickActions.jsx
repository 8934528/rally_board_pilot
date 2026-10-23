function QuickActions({
  onLive,
  onPause,
  onReset
}) {
  return (
    <div className="quick-actions">

      <button
        type="button"
        className="quick-btn live-btn"
        onClick={onLive}
      >
        <i className="bi bi-broadcast" />
        GO LIVE
      </button>

      <button
        type="button"
        className="quick-btn pause-btn"
        onClick={onPause}
      >
        <i className="bi bi-pause-circle" />
        PAUSE
      </button>

      <button
        type="button"
        className="quick-btn reset-btn"
        onClick={onReset}
      >
        <i className="bi bi-arrow-counterclockwise" />
        RESET
      </button>

    </div>
  );
}

export default QuickActions;
