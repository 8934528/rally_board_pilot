function RoundPage({ gameState }) {
  return (
    <section className="board-special-page round-page">

      <div className="special-eyebrow">
        RALLY BOARD PILOT
      </div>

      <div className="round-number">
        ROUND {gameState.round.number}
      </div>

      <h1>
        {gameState.round.name}
      </h1>

      <div className="round-line" />

      <p>
        Get ready. The next challenge is about
        to begin.
      </p>

    </section>
  );
}

export default RoundPage;
