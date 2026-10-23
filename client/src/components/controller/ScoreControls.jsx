import Button from '../common/Button';
import { formatScore } from '../../utils/formatScore';

function ScoreControls({
  team,
  teamData,
  onAdd,
  onSubtract
}) {
  return (
    <article className="control-card">

      <div className="control-card-header">

        <div>
          <span
            className={`team-badge ${
              team === 'A'
                ? 'team-a-badge'
                : 'team-b-badge'
            }`}
          >
            TEAM {team}
          </span>

          <h2>{teamData.name}</h2>
        </div>

        <div
          className="color-preview"
          style={{
            backgroundColor:
              teamData.color
          }}
        />
      </div>

      <div className="live-score">
        {formatScore(teamData.score)}
      </div>

      <div className="score-buttons">

        {[1, 5, 10].map(
          (points) => (
            <Button
              key={`minus-${points}`}
              variant="score-minus"
              onClick={() =>
                onSubtract(
                  team,
                  points
                )
              }
            >
              −{points}
            </Button>
          )
        )}

        {[1, 5, 10].map(
          (points) => (
            <Button
              key={`plus-${points}`}
              variant="score-plus"
              onClick={() =>
                onAdd(
                  team,
                  points
                )
              }
            >
              +{points}
            </Button>
          )
        )}

      </div>

    </article>
  );
}

export default ScoreControls;
