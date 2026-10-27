import Button from '../common/Button';
import { useGame } from '../../context/GameContext';

function HostRoundControls({
  gameState,
  onRound
}) {
  const { hasHostPermission } = useGame();
  const canRound = hasHostPermission('round');

  const nextRound = () => {
    const nextNum = gameState.round.number + 1;
    onRound(nextNum, `Round ${nextNum}`);
  };

  return (
    <section
      className="host-panel host-round-panel"
      id="host-round-panel"
    >
      <div className="host-round-meta">
        <small className="host-panel-eyebrow">
          CURRENT ROUND
        </small>

        <div className="host-round-readout">
          <span className="host-round-num-badge">
            ROUND {gameState.round.number}
          </span>

          <span className="host-round-name-text">
            {gameState.round.name}
          </span>
        </div>
      </div>

      {canRound && (
        <Button
          variant="primary"
          size="small"
          onClick={nextRound}
          id="btn-host-next-round"
        >
          <i className="bi bi-chevron-right" aria-hidden="true" />
          <span>NEXT ROUND</span>
          <span className="rbp-shortcut-badge">CTRL + N</span>
        </Button>
      )}
    </section>
  );
}

export default HostRoundControls;
