import Button from '../common/Button';

function RoundDirector({
  round,
  onUpdateRound
}) {
  const handleNameChange = (e) => {
    onUpdateRound(round.number, e.target.value);
  };

  const handleNextRound = () => {
    const nextNum = round.number + 1;
    onUpdateRound(nextNum, `Round ${nextNum}`);
  };

  const handleDecrement = () => {
    if (round.number > 1) {
      onUpdateRound(round.number - 1, round.name);
    }
  };

  const handleIncrement = () => {
    if (round.number < 99) {
      onUpdateRound(round.number + 1, round.name);
    }
  };

  return (
    <div className="round-director-panel" id="round-director-panel">
      <div className="round-director-header">
        <div className="round-director-titles">
          <div className="eyebrow">ROUND DIRECTOR</div>
          <h2 className="panel-title-text">Round Configuration</h2>
        </div>

        <Button
          variant="primary"
          size="small"
          onClick={handleNextRound}
          id="btn-next-round"
          className="next-round-btn"
        >
          <span>Next Round</span>
          <i className="bi bi-chevron-right" aria-hidden="true" />
          <span className="rbp-shortcut-badge">CTRL + N</span>
        </Button>
      </div>

      <div className="round-director-grid">
        <div className="round-control-item round-number-item">
          <label className="field-label">Round Number</label>
          <div className="round-stepper-control" role="group" aria-label="Round Number Selector">
            <button
              type="button"
              className="round-step-btn"
              onClick={handleDecrement}
              disabled={round.number <= 1}
              aria-label="Decrease round"
              title="Decrease round number"
            >
              <i className="bi bi-dash" aria-hidden="true" />
            </button>
            <div className="round-stepper-value" aria-live="polite">
              <span className="round-stepper-num">{round.number}</span>
            </div>
            <button
              type="button"
              className="round-step-btn"
              onClick={handleIncrement}
              disabled={round.number >= 99}
              aria-label="Increase round"
              title="Increase round number"
            >
              <i className="bi bi-plus" aria-hidden="true" />
            </button>
          </div>
        </div>


        <div className="round-control-item round-title-item">
          <label htmlFor="roundNameInput" className="field-label">
            Round Title
          </label>
          <div className="round-input-container">
            <i className="bi bi-pencil-square round-input-icon" aria-hidden="true" />
            <input
              id="roundNameInput"
              type="text"
              className="round-name-input"
              value={round.name}
              maxLength={40}
              onChange={handleNameChange}
              placeholder="e.g. Opening Round, Speed Round..."
            />
          </div>
        </div>


        <div className="round-control-item round-preview-item">
          <label className="field-label">Live Board Preview</label>
          <div className="round-badge-pill" title="Preview of round badge as shown on board">
            <span className="round-pill-number">R{round.number}</span>
            <span className="round-pill-divider">•</span>
            <span className="round-pill-title">{round.name || `Round ${round.number}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoundDirector;
