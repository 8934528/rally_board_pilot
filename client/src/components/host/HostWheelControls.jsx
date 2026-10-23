import Button from '../common/Button';

function HostWheelControls({
  onPage,
  onSpin
}) {
  return (
    <section className="host-panel">

      <div>
        <small>
          WHEEL
        </small>

        <h2>
          Spin Wheel
        </h2>
      </div>

      <div className="host-panel-actions">

        <Button
          variant="secondary"
          onClick={() =>
            onPage('wheel')
          }
        >
          SHOW WHEEL
        </Button>

        <Button
          variant="primary"
          onClick={onSpin}
        >
          SPIN
        </Button>

      </div>

    </section>
  );
}

export default HostWheelControls;
