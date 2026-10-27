import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { DEFAULT_QUESTION_BANK } from '../../data/questionBank';

function QuestionManagerModal({
  open,
  onClose,
  currentQuestion,
  questionStatus = 'idle',
  questionHistory = [],
  onSetQuestion,
  onShowQuestion,
  onRevealAnswer,
  onMarkQuestion,
  onClearQuestion,
  onChangePage
}) {
  const [activeTab, setActiveTab] = useState('bank'); // 'bank' | 'control' | 'create'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [customBank, setCustomBank] = useState([]);

  // Custom question form state
  const [customText, setCustomText] = useState('');
  const [customCategory, setCustomCategory] = useState('General Trivia');
  const [customDifficulty, setCustomDifficulty] = useState('medium');
  const [customPoints, setCustomPoints] = useState(10);
  const [customOptions, setCustomOptions] = useState(['', '', '', '']);
  const [customCorrect, setCustomCorrect] = useState(0);
  const [customExplanation, setCustomExplanation] = useState('');

  const allQuestions = [...DEFAULT_QUESTION_BANK, ...customBank];

  const categories = ['ALL', ...new Set(allQuestions.map((q) => q.category))];

  const filteredQuestions = allQuestions.filter((q) => {
    const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectQuestion = (q) => {
    onSetQuestion(q);
    setActiveTab('control');
  };

  const handleShowOnBoard = () => {
    onShowQuestion();
    if (typeof onChangePage === 'function') {
      onChangePage('question');
    }
  };

  const handleAddCustomQuestion = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newQ = {
      id: `custom-${Date.now()}`,
      category: customCategory.trim() || 'Custom',
      difficulty: customDifficulty,
      text: customText.trim(),
      options: customOptions.map((o) => o.trim()).filter(Boolean),
      correctAnswer: customCorrect,
      points: Number(customPoints) || 10,
      explanation: customExplanation.trim(),
      metadata: { custom: true }
    };

    setCustomBank((prev) => [newQ, ...prev]);
    onSetQuestion(newQ);
    setActiveTab('control');

    // Reset form
    setCustomText('');
    setCustomOptions(['', '', '', '']);
    setCustomExplanation('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="QUESTION MANAGEMENT"
      size="large"
    >
      <div className="qm-modal-container">
        <div className="qm-nav-tabs">
          <button
            type="button"
            className={`qm-tab-btn ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
            id="tab-qm-bank"
          >
            <i className="bi bi-collection" />
            <span>Question Bank ({allQuestions.length})</span>
          </button>

          <button
            type="button"
            className={`qm-tab-btn ${activeTab === 'control' ? 'active' : ''}`}
            onClick={() => setActiveTab('control')}
            id="tab-qm-control"
          >
            <i className="bi bi-play-circle" />
            <span>Active Question Control</span>
            {currentQuestion && <span className="qm-active-dot" />}
          </button>

          <button
            type="button"
            className={`qm-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
            id="tab-qm-create"
          >
            <i className="bi bi-plus-circle" />
            <span>Create Question</span>
          </button>
        </div>






        {/* QUESTION BANK */}
        {activeTab === 'bank' && (
          <div className="qm-tab-content qm-bank-view">
            <div className="qm-search-filters-row">
              <div className="qm-search-wrapper">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search questions by keyword or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="qm-search-input"
                  id="qm-search-input"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="qm-category-select"
                aria-label="Filter by Category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="qm-questions-list">
              {filteredQuestions.length === 0 ? (
                <div className="qm-empty-msg">No questions found matching your filter.</div>
              ) : (
                filteredQuestions.map((q) => {
                  const isCurrent = currentQuestion?.id === q.id;
                  return (
                    <div
                      key={q.id}
                      className={`qm-question-item ${isCurrent ? 'is-active-item' : ''}`}
                    >
                      <div className="qm-q-meta">
                        <span className="qm-q-category">{q.category}</span>
                        <span className="qm-q-diff">{q.difficulty.toUpperCase()}</span>
                        <span className="qm-q-pts">{q.points} PTS</span>
                      </div>

                      <div className="qm-q-text">{q.text}</div>

                      <div className="qm-q-actions">
                        <Button
                          variant={isCurrent ? 'success' : 'primary'}
                          size="small"
                          onClick={() => handleSelectQuestion(q)}
                        >
                          <i className={`bi ${isCurrent ? 'bi-check-circle' : 'bi-arrow-right-circle'}`} />
                          <span>{isCurrent ? 'Selected (Active)' : 'Load Question'}</span>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}






        {/* ACTIVE QUESTION CONTROL */}
        {activeTab === 'control' && (
          <div className="qm-tab-content qm-control-view">
            {!currentQuestion ? (
              <div className="qm-no-active">
                <i className="bi bi-patch-question" />
                <p>No question currently selected.</p>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setActiveTab('bank')}
                >
                  Choose From Question Bank
                </Button>
              </div>
            ) : (
              <div className="qm-live-controller-card">
                <div className="qm-live-header">
                  <div>
                    <span className="qm-live-category">{currentQuestion.category}</span>
                    <span className="qm-live-status-badge">STATUS: {questionStatus.toUpperCase()}</span>
                  </div>
                  <span className="qm-live-points">{currentQuestion.points} POINTS</span>
                </div>

                <h3 className="qm-live-question-text">{currentQuestion.text}</h3>

                {currentQuestion.options && currentQuestion.options.length > 0 && (
                  <div className="qm-live-options-preview">
                    {currentQuestion.options.map((opt, idx) => {
                      const isCorrect = idx === currentQuestion.correctAnswer || opt === currentQuestion.correctAnswer;
                      return (
                        <div
                          key={idx}
                          className={`qm-live-opt ${isCorrect && (questionStatus === 'revealed' || questionStatus === 'marked') ? 'opt-highlight-correct' : ''}`}
                        >
                          <span className="qm-live-opt-letter">{['A', 'B', 'C', 'D'][idx] || idx + 1}</span>
                          <span className="qm-live-opt-text">{opt}</span>
                          {isCorrect && <span className="qm-live-correct-tag">Correct Answer</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.explanation && (
                  <div className="qm-live-explanation">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </div>
                )}

                {/* Workflow */}
                <div className="qm-stage-control-buttons">
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={handleShowOnBoard}
                    id="btn-qm-show-board"
                  >
                    <i className="bi bi-display" />
                    <span>Show on Game Board</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={onRevealAnswer}
                    disabled={questionStatus === 'revealed' || questionStatus === 'marked'}
                    id="btn-qm-reveal-answer"
                  >
                    <i className="bi bi-eye" />
                    <span>Reveal Answer</span>
                  </Button>

                  <Button
                    variant="danger"
                    size="medium"
                    onClick={onClearQuestion}
                    id="btn-qm-clear-question"
                  >
                    <i className="bi bi-x-circle" />
                    <span>Clear / Next Question</span>
                  </Button>
                </div>

                {/* Points */}
                <div className="qm-scoring-actions-section">
                  <div className="qm-scoring-title">MARK & AWARD POINTS:</div>
                  <div className="qm-scoring-buttons-grid">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => onMarkQuestion('A', true, true)}
                      id="btn-qm-award-a"
                    >
                      <i className="bi bi-check-lg" />
                      <span>Team A Correct (+{currentQuestion.points} pts)</span>
                    </Button>

                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onMarkQuestion('A', false, false)}
                    >
                      <i className="bi bi-x-lg" />
                      <span>Team A Incorrect</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => onMarkQuestion('B', true, true)}
                      id="btn-qm-award-b"
                    >
                      <i className="bi bi-check-lg" />
                      <span>Team B Correct (+{currentQuestion.points} pts)</span>
                    </Button>

                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onMarkQuestion('B', false, false)}
                    >
                      <i className="bi bi-x-lg" />
                      <span>Team B Incorrect</span>
                    </Button>
                  </div>
                </div>

                {/* Question History */}
                {questionHistory && questionHistory.length > 0 && (
                  <div className="qm-history-section">
                    <div className="qm-history-title">Recent Question History:</div>
                    <div className="qm-history-list">
                      {questionHistory.slice(0, 5).map((h, i) => (
                        <div key={i} className="qm-history-item">
                          <span className={`qm-history-icon ${h.correct ? 'is-correct' : 'is-wrong'}`}>
                            <i className={`bi ${h.correct ? 'bi-check' : 'bi-x'}`} />
                          </span>
                          <span className="qm-history-text">{h.text}</span>
                          <span className="qm-history-award">
                            Team {h.team} {h.correct ? `+${h.points} pts` : 'Incorrect'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {/* CREATE CUSTOM QUESTION */}
        {activeTab === 'create' && (
          <form onSubmit={handleAddCustomQuestion} className="qm-tab-content qm-create-form">
            <div className="qm-form-group">
              <label htmlFor="qm-input-text">Question Text:</label>
              <textarea
                id="qm-input-text"
                rows={3}
                className="qm-textarea"
                placeholder="Type your question..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                required
              />
            </div>

            <div className="qm-form-row">
              <div className="qm-form-group">
                <label htmlFor="qm-input-category">Category:</label>
                <input
                  id="qm-input-category"
                  type="text"
                  className="qm-input"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              </div>

              <div className="qm-form-group">
                <label htmlFor="qm-input-diff">Difficulty:</label>
                <select
                  id="qm-input-diff"
                  className="qm-input"
                  value={customDifficulty}
                  onChange={(e) => setCustomDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="qm-form-group">
                <label htmlFor="qm-input-pts">Points:</label>
                <input
                  id="qm-input-pts"
                  type="number"
                  min={1}
                  max={100}
                  className="qm-input"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(e.target.value)}
                />
              </div>
            </div>

            <div className="qm-form-group">
              <label>Multiple Choice Options (Select radio for correct answer):</label>
              {customOptions.map((opt, idx) => (
                <div key={idx} className="qm-option-input-row">
                  <input
                    type="radio"
                    name="correct-option"
                    checked={customCorrect === idx}
                    onChange={() => setCustomCorrect(idx)}
                    aria-label={`Mark option ${['A', 'B', 'C', 'D'][idx]} as correct`}
                  />
                  <span className="qm-opt-letter">{['A', 'B', 'C', 'D'][idx]}:</span>
                  <input
                    type="text"
                    className="qm-input"
                    placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...customOptions];
                      updated[idx] = e.target.value;
                      setCustomOptions(updated);
                    }}
                    required={idx < 2}
                  />
                </div>
              ))}
            </div>

            <div className="qm-form-group">
              <label htmlFor="qm-input-expl">Optional Explanation:</label>
              <input
                id="qm-input-expl"
                type="text"
                className="qm-input"
                placeholder="Brief explanation shown after answer is revealed..."
                value={customExplanation}
                onChange={(e) => setCustomExplanation(e.target.value)}
              />
            </div>

            <div className="qm-form-footer">
              <Button variant="primary" size="medium" type="submit" id="btn-create-question-submit">
                <i className="bi bi-plus-lg" />
                <span>Save & Set Active</span>
              </Button>
            </div>
          </form>
        )}

        <div className="qm-modal-footer">
          <Button variant="secondary" size="medium" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default QuestionManagerModal;
