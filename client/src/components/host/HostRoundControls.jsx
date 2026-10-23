import Button from '../common/Button';

function HostRoundControls({
  gameState,
  onRound
}) {
  const nextRound = () => {
    onRound(
      gameState.round.number + 1,
      `Round ${
        gameState.round.number + 1
      }`
    );
  };

  return (
    <section className="host-panel">

      <div>
        <small>
          CURRENT ROUND
        </small>

        <h2>
          {gameState.round.number}
        </h2>

        <p>
          {gameState.round.name}
        </p>
      </div>

      <Button
        variant="primary"
        onClick={nextRound}
      >
        NEXT ROUND
      </Button>

    </section>
  );
}

export default HostRoundControls;