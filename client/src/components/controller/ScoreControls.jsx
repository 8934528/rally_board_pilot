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
      onClick={() => type === 'minus' ? onSubtract(team, item.value) : onAdd(team, item.value)
      }
    >
      {item.label}
    </Button>
  );

  return (
    <article className="control-card score-control-card" id={`score-card-${team}`}>
      <div className="control-card-header">
        <div className="team-header-info">
          <span
            className={`team-badge ${
              team === 'A' ? 'team-a-badge' : 'team-b-badge'
            }`}
          >
            TEAM {team}
          </span>
          <h2 className="team-title-text">{teamData.name}</h2>
        </div>

        <div
          className="color-preview-indicator"
          style={{
            backgroundColor: teamData.color
          }}
          title={`${teamData.name} color: ${teamData.color}`}
        />
      </div>

      <div className="live-score-display" id={`live-score-${team}`}>
        {formatScore(teamData.score)}
      </div>

      <div className="row g-2 score-split-row">
        <div className="col-4">
          <div
            className="score-square-grid score-square-grid-minus"
            role="group"
            aria-label={`Subtract points for Team ${team}`}
          >
            {SUBTRACT_BUTTONS.map((item) => renderButton(item, 'minus'))}
          </div>
        </div>

        <div className="col-8">
          <div
            className="score-square-grid score-square-grid-plus"
            role="group"
            aria-label={`Add points for Team ${team}`}
          >
            {ADD_BUTTONS.map((item) => renderButton(item, 'plus'))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ScoreControls;
