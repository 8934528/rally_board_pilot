import Button from '../common/Button';
import WheelPage from '../board/WheelPage';

function HostWheelControls({
  gameState,
  onPage,
  onSpin
}) {
  const isWheelPage = gameState?.board?.activePage === 'wheel';
  const spinning = gameState?.wheel?.spinning;
  const result = gameState?.wheel?.result;

  return (
    <section className="host-panel host-wheel-panel" id="host-wheel-panel">
      <div className="host-wheel-header">
        <div>
          <small className="host-panel-eyebrow">RALLY WHEEL</small>
          <h2 className="host-panel-title">
            {spinning ? 'Wheel Spinning...' : result ? `Result: ${result}` : 'Wheel Ready'}
          </h2>
        </div>

        <div className="host-panel-actions">
          <Button
            variant={isWheelPage ? 'primary' : 'secondary'}
            size="small"
            onClick={() => onPage('wheel')}
          >
            <i className="bi bi-display" />
            <span>SHOW ON BOARD</span>
          </Button>

          <Button
            variant="success"
            size="small"
            onClick={onSpin}
            disabled={spinning}
            id="btn-host-spin"
          >
            <i className="bi bi-arrow-repeat" />
            <span>SPIN</span>
            <span className="rbp-shortcut-badge">CTRL + SHIFT + X</span>
          </Button>
        </div>
      </div>

      <div className="host-mini-wheel-wrapper">
        <WheelPage gameState={gameState} mini={true} />
      </div>
    </section>
  );
}

export default HostWheelControls;
