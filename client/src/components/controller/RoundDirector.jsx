import RotaryWheel from '../common/RotaryWheel';
import Button from '../common/Button';

function RoundDirector({
  round,
  onUpdateRound
}) {
  const handleNumberChange = (num) => {
    onUpdateRound(num, round.name);
  };

  const handleNameChange = (e) => {
    onUpdateRound(round.number, e.target.value);
  };

  const handleNextRound = () => {
    const nextNum = round.number + 1;
    onUpdateRound(nextNum, `Round ${nextNum}`);
  };

  return (
    <div className="round-director-panel" id="round-director-panel">
      <div className="round-director-header">
        <div>
          <div className="eyebrow">ROUND DIRECTOR</div>
          <h2 className="panel-title-text">Round Configuration</h2>
        </div>

        <div className="round-actions-wrap">
          <Button
            variant="primary"
            size="small"
            onClick={handleNextRound}
            id="btn-next-round"
            className="next-round-btn"
          >
            <i className="bi bi-chevron-right" />
            <span>Next Round</span>
            <span className="rbp-shortcut-badge">N</span>
          </Button>
        </div>
      </div>

      <div className="round-controls-grid">
        <div className="round-rotary-column">
          <label className="field-label">Round Number</label>
          <RotaryWheel
            value={round.number}
            min={1}
            max={99}
            onChange={handleNumberChange}
            label="Round Number Selector"
          />
        </div>

        <div className="round-name-column">
          <label htmlFor="roundNameInput" className="field-label">
            Round Title
          </label>
          <input
            id="roundNameInput"
            type="text"
            className="round-name-input"
            value={round.name}
            maxLength={40}
            onChange={handleNameChange}
            placeholder="e.g. Semi Finals, Speed Round..."
          />
        </div>

        <div className="round-preview-column">
          <label className="field-label">Live Board Preview</label>
          <div className="round-badge-pill">
            <span className="round-pill-number">R{round.number}</span>
            <span className="round-pill-title">{round.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoundDirector;
