import Button from '../common/Button';
import { formatScore } from '../../utils/formatScore';

const SUBTRACT_BUTTONS = [
  { value: 10, label: '−10' },
  { value: 5, label: '−5' },
  { value: 2, label: '−2' },
  { value: 1, label: '−1' }
];

const ADD_BUTTONS = [
  { value: 1, label: '+1' },
  { value: 2, label: '+2' },
  { value: 5, label: '+5' },
  { value: 10, label: '+10' }
];

function ScoreControls({
  team,
  teamData,
  onAdd,
  onSubtract
}) {
  const renderButton = (item, type) => (
    <Button
      key={`${team}-${type}-${item.value}`}
      id={`btn-score-${team}-${type}-${item.value}`}
      variant={type === 'minus' ? 'score-minus' : 'score-plus'}
      size="small"
      className="score-step-btn score-square-btn"
      onClick={() =>
        type === 'minus' ? onSubtract(team, item.value) : onAdd(team, item.value)
      }
    >
      {item.label}
    </Button>
  );

  return (
    <article
      className="control-card score-control-card"
      id={`score-card-${team}`}
      style={{ '--team-accent-col': teamData.color }}
    >
      <div className="score-control-grid">
        <div className="score-control-score-column">
          <div className="score-control-team-marker">
            <span
              className={`team-badge ${
                team === 'A' ? 'team-a-badge' : 'team-b-badge'
              }`}
            >
              TEAM {team}
            </span>

            <span
              className="color-preview-indicator"
              style={{ backgroundColor: teamData.color }}
              title={`${teamData.name} color: ${teamData.color}`}
            />
          </div>

          <div
            className="live-score-display"
            id={`live-score-${team}`}
          >
            {formatScore(teamData.score)}
          </div>
        </div>

        
          <span className="score-action-team-name">
            {teamData.name}
          </span>

        <div className="score-control-action-column score-control-minus-column">

          <div className="score-square-grid score-square-grid-minus"
            role="group"
            aria-label={`Subtract points for Team ${team}`}
          >
            {SUBTRACT_BUTTONS.map((item) =>
              renderButton(item, 'minus')
            )}
          </div>
        </div>

        <div className="score-control-action-column score-control-plus-column">

          <div
            className="score-square-grid score-square-grid-plus"
            role="group"
            aria-label={`Add points for Team ${team}`}
          >
            {ADD_BUTTONS.map((item) =>
              renderButton(item, 'plus')
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ScoreControls;
