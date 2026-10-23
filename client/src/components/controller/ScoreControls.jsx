import Button from '../common/Button';
import { formatScore } from '../../utils/formatScore';

const SCORE_BUTTONS = [
  { value: 10, type: 'minus', label: '−10' },
  { value: 5,  type: 'minus', label: '−5' },
  { value: 2,  type: 'minus', label: '−2' },
  { value: 1,  type: 'minus', label: '−1' },
  { value: 1,  type: 'plus',  label: '+1' },
  { value: 2,  type: 'plus',  label: '+2' },
  { value: 5,  type: 'plus',  label: '+5' },
  { value: 10, type: 'plus',  label: '+10' }
];

function ScoreControls({
  team,
  teamData,
  onAdd,
  onSubtract
}) {
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

      <div className="score-buttons-grid" role="group" aria-label={`Score adjustment for Team ${team}`}>
        {SCORE_BUTTONS.map((item) => (
          <Button
            key={`${team}-${item.type}-${item.value}`}
            id={`btn-score-${team}-${item.type}-${item.value}`}
            variant={item.type === 'minus' ? 'score-minus' : 'score-plus'}
            size="small"
            className="score-step-btn"
            onClick={() =>
              item.type === 'minus'
                ? onSubtract(team, item.value)
                : onAdd(team, item.value)
            }
          >
            {item.label}
          </Button>
        ))}
      </div>
    </article>
  );
}

export default ScoreControls;
