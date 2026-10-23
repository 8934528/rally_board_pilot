import Button from '../common/Button';

function HostScorePanel({
  gameState,
  onAdd,
  onSubtract
}) {
  return (
    <div className="host-score-grid" role="group" aria-label="Host Score Adjustments">
      {['A', 'B'].map((team) => {
        const data = gameState.teams[team];

        return (
          <section
            className={`host-score-card host-team-${team.toLowerCase()}`}
            key={team}
            id={`host-score-card-${team}`}
            style={{ '--team-accent-col': data.color }}
          >
            <div className="host-card-top">
              <span className="host-team-badge">TEAM {team}</span>
              <h2 className="host-team-name">{data.name}</h2>
            </div>

            <strong className="host-score-digits" id={`host-score-digits-${team}`}>
              {data.score}
            </strong>

            <div className="host-score-buttons" role="group" aria-label={`Points for Team ${team}`}>
              {[-5, -1, 1, 5].map((pts) => {
                const isMinus = pts < 0;
                return (
                  <Button
                    key={pts}
                    variant={isMinus ? 'score-minus' : 'score-plus'}
                    size="small"
                    className="host-pt-btn"
                    onClick={() =>
                      isMinus ? onSubtract(team, Math.abs(pts)) : onAdd(team, pts)
                    }
                  >
                    {isMinus ? `−${Math.abs(pts)}` : `+${pts}`}
                  </Button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default HostScorePanel;
