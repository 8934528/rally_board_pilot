import Button from '../common/Button';
import { useGame } from '../../context/GameContext';

const SCORE_STEPS = [-5, -1, 1, 5];

function HostScorePanel({
  team,
  gameState,
  onAdd,
  onSubtract
}) {
  const { hasHostPermission } = useGame();
  const canScore = hasHostPermission('score');
  const data = gameState.teams[team];

  return (
    <section
      className={`host-score-card host-team-${team.toLowerCase()}`}
      id={`host-score-card-${team}`}
      style={{
        '--team-accent-col': data.color
      }}
    >
      <div className="host-card-top">
        <span className="host-team-badge">
          TEAM {team}
        </span>

        <h2 className="host-team-name">
          {data.name}
        </h2>
      </div>

      <div className="host-score-content-row">
        <div className="host-score-game-state">
          <strong
            className="host-score-digits"
            id={`host-score-digits-${team}`}
          >
            {data.score}
          </strong>
        </div>

        {canScore && (
          <div
            className="host-score-buttons"
            role="group"
            aria-label={`Points for Team ${team}`}
          >
            {SCORE_STEPS.map((pts) => {
              const isMinus = pts < 0;
              const amount = Math.abs(pts);

              return (
                <Button
                  key={pts}
                  variant={isMinus ? 'score-minus' : 'score-plus'}
                  size="small"
                  className="host-pt-btn"
                  onClick={() =>
                    isMinus ? onSubtract(team, amount) : onAdd(team, amount)
                  }
                  aria-label={`${isMinus ? 'Subtract' : 'Add'} ${amount} points`}
                >
                  {isMinus ? `−${amount}` : `+${amount}`}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default HostScorePanel;
