import Button from '../common/Button';

function HostControls({
  onLive,
  onPause,
  onPage
}) {
  return (
    <div className="host-controls">

      <Button
        variant="success"
        onClick={onLive}
      >
        GO LIVE
      </Button>

      <Button
        variant="warning"
        onClick={onPause}
      >
        PAUSE
      </Button>

      <Button
        variant="secondary"
        onClick={() =>
          onPage('scoreboard')
        }
      >
        SCOREBOARD
      </Button>

    </div>
  );
}

export default HostControls;
