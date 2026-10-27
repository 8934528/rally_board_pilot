import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import { useGame } from '../../context/GameContext';

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
      className={`host-score-card host-team-${team.toLowerCase()} ${!canScore ? 'host-card-restricted' : ''}`}
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

        <div
          className="host-score-buttons"
          role="group"
          aria-label={`Points for Team ${team}`}
        >
          {[-5, -1, 1, 5].map((pts) => {
            const isMinus = pts < 0;
            const amount = Math.abs(pts);
            const btn = (
              <Button
                key={pts}
                variant={isMinus ? 'score-minus' : 'score-plus'}
                size="small"
                className="host-pt-btn"
                disabled={!canScore}
                onClick={() =>
                  canScore && (isMinus ? onSubtract(team, amount) : onAdd(team, amount))
                }
                aria-label={`${isMinus ? 'Subtract' : 'Add'} ${amount} points`}
              >
                {isMinus ? `−${amount}` : `+${amount}`}
              </Button>
            );

            if (!canScore) {
              return (
                <Tooltip key={pts} content="Score adjustments restricted by Controller">
                  <span>{btn}</span>
                </Tooltip>
              );
            }

            return btn;
          })}
        </div>
      </div>
    </section>
  );
}

export default HostScorePanel;
