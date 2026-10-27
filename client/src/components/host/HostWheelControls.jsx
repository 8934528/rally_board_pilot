import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import WheelPage from '../board/WheelPage';
import { useGame } from '../../context/GameContext';

function HostWheelControls({
  gameState,
  onPage,
  onSpin
}) {
  const { hasHostPermission } = useGame();
  const canWheel = hasHostPermission('wheel');
  const canStatus = hasHostPermission('status');

  const isWheelPage = gameState?.board?.activePage === 'wheel';
  const spinning = gameState?.wheel?.spinning;
  const result = gameState?.wheel?.result;

  const spinBtn = (
    <Button
      variant="success"
      size="small"
      onClick={() => canWheel && onSpin()}
      disabled={spinning || !canWheel}
      id="btn-host-spin"
    >
      <i className="bi bi-arrow-repeat" />
      <span>SPIN</span>
      <span className="rbp-shortcut-badge">CTRL + SHIFT + X</span>
    </Button>
  );

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
          <Tooltip content={canStatus ? 'Show Wheel on Board' : 'Page switching restricted by Controller'}>
            <span>
              <Button
                variant={isWheelPage ? 'primary' : 'secondary'}
                size="small"
                onClick={() => canStatus && onPage('wheel')}
                disabled={!canStatus}
              >
                <i className="bi bi-display" />
                <span>SHOW ON BOARD</span>
              </Button>
            </span>
          </Tooltip>

          {!canWheel ? (
            <Tooltip content="Wheel spin restricted by Controller">
              <span>{spinBtn}</span>
            </Tooltip>
          ) : (
            spinBtn
          )}
        </div>
      </div>

      <div className="host-mini-wheel-wrapper">
        <WheelPage gameState={gameState} mini={true} />
      </div>
    </section>
  );
}

export default HostWheelControls;
