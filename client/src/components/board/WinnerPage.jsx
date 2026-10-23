function WinnerPage({ gameState }) {
  const winner =
    gameState.winner.team;

  const team =
    winner
      ? gameState.teams[winner]
      : null;

  return (
    <section className="board-special-page winner-page">

      <div className="special-eyebrow">
        GAME COMPLETE
      </div>

      <div className="winner-star">
        ★
      </div>

      <div className="winner-label">
        WINNER
      </div>

      <h1
        style={{
          color:
            team?.color || '#ffffff'
        }}
      >
        {team?.name || 'TIE GAME'}
      </h1>

      <p>
        {gameState.winner.message}
      </p>

    </section>
  );
}

export default WinnerPage;
