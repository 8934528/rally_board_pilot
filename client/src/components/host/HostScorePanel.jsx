import Button from '../common/Button';

function HostScorePanel({
  gameState,
  onAdd,
  onSubtract
}) {
  return (
    <div className="host-score-grid">

      {['A', 'B'].map(
        (team) => {
          const data =
            gameState.teams[team];

          return (
            <section
              className="host-score-card"
              key={team}
            >
              <span>
                TEAM {team}
              </span>

              <h2>
                {data.name}
              </h2>

              <strong>
                {data.score}
              </strong>

              <div className="host-score-buttons">

                <Button
                  variant="score-minus"
                  onClick={() =>
                    onSubtract(
                      team,
                      5
                    )
                  }
                >
                  −5
                </Button>

                <Button
                  variant="score-plus"
                  onClick={() =>
                    onAdd(
                      team,
                      5
                    )
                  }
                >
                  +5
                </Button>

              </div>
            </section>
          );
        }
      )}

    </div>
  );
}

export default HostScorePanel;
