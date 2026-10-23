function WheelPage({ gameState }) {
  const entries = gameState.wheel.entries;

  return (
    <section className="board-special-page wheel-page">

      <div className="special-eyebrow">
        RALLY WHEEL
      </div>

      <div
        className={`wheel ${
          gameState.wheel.spinning
            ? 'wheel-spinning'
            : ''
        }`}
      >
        <div className="wheel-center">
          {gameState.wheel.spinning
            ? 'SPIN'
            : 'RALLY'}
        </div>

        {entries.map(
          (entry, index) => {
            const angle =
              (360 / entries.length) *
              index;

            return (
              <div
                className="wheel-entry"
                key={`${entry}-${index}`}
                style={{
                  transform: `rotate(${angle}deg)`
                }}
              >
                <span>
                  {entry}
                </span>
              </div>
            );
          }
        )}
      </div>

      {gameState.wheel.result && (
        <div className="wheel-result">
          {gameState.wheel.result}
        </div>
      )}

    </section>
  );
}

export default WheelPage;
