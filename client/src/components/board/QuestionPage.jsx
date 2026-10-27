function QuestionPage({ gameState }) {
  const questionState = gameState?.question;
  const current = questionState?.current;
  const status = questionState?.status || 'idle';
  const lastResult = questionState?.lastResult;

  if (!current) {
    return (
      <div className="board-question-screen is-empty" id="board-question-screen">
        <div className="question-idle-card">
          <i className="bi bi-patch-question-fill" aria-hidden="true" />
          <h2>QUESTION STAGE</h2>
          <p>Waiting for the Controller to present a question...</p>
        </div>
      </div>
    );
  }

  const isRevealed = status === 'revealed' || status === 'marked';
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="board-question-screen" id="board-question-screen">
      <div className="question-stage-container">
        {/* Header badges: Category and Points */}
        <div className="question-stage-header">
          <span className="question-category-pill">
            <i className="bi bi-tag" aria-hidden="true" />
            <span>{current.category || 'General Trivia'}</span>
          </span>

          <div className="question-header-right">
            <span className="question-difficulty-pill">
              {current.difficulty ? current.difficulty.toUpperCase() : 'MEDIUM'}
            </span>
            <span className="question-points-pill">
              <i className="bi bi-star-fill" aria-hidden="true" />
              <span>{current.points || 10} PTS</span>
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="question-text-box">
          <h1 className="question-text-heading">{current.text}</h1>
        </div>

        {/* Options Grid */}
        {current.options && current.options.length > 0 && (
          <div className="question-options-grid">
            {current.options.map((opt, idx) => {
              const isCorrect = isRevealed && (
                idx === current.correctAnswer ||
                opt === current.correctAnswer ||
                String(idx) === String(current.correctAnswer)
              );

              return (
                <div
                  key={idx}
                  className={`question-option-card ${isCorrect ? 'is-correct-option' : ''} ${isRevealed && !isCorrect ? 'is-faded-option' : ''}`}
                >
                  <span className="option-letter-badge">
                    {optionLabels[idx] || idx + 1}
                  </span>
                  <span className="option-text">{opt}</span>
                  {isCorrect && (
                    <span className="option-correct-badge">
                      <i className="bi bi-check-circle-fill" aria-hidden="true" />
                      <span>CORRECT</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Answer Explanation */}
        {isRevealed && current.explanation && (
          <div className="question-explanation-banner">
            <div className="explanation-icon">
              <i className="bi bi-info-circle-fill" aria-hidden="true" />
            </div>
            <div className="explanation-body">
              <strong>EXPLANATION:</strong>
              <p>{current.explanation}</p>
            </div>
          </div>
        )}

        {/* Mark Result Banner */}
        {status === 'marked' && lastResult && (
          <div className={`question-marked-banner ${lastResult.correct ? 'banner-correct' : 'banner-incorrect'}`}>
            <i className={`bi ${lastResult.correct ? 'bi-check-lg' : 'bi-x-lg'}`} aria-hidden="true" />
            <span>
              {lastResult.correct
                ? `Team ${lastResult.team} Answered Correctly! (+${lastResult.points} Points)`
                : `Team ${lastResult.team} Answered Incorrectly`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionPage;
