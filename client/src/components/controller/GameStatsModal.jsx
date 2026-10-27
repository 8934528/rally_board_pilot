import Modal from '../common/Modal';
import Button from '../common/Button';
import { deriveGameStats } from '../../utils/statsDeriver';

function GameStatsModal({
  open,
  onClose,
  gameState
}) {
  const stats = deriveGameStats(gameState);

  if (!stats) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="GAME STATISTICS & METRICS"
      size="large"
    >
      <div className="stats-modal-container">
        <section className="stats-section">
          <div className="stats-section-header">
            <i className="bi bi-speedometer2" aria-hidden="true" />
            <h3>GAME OVERVIEW</h3>
          </div>

          <div className="stats-overview-grid">
            <div className="stat-card">
              <span className="stat-label">STATUS</span>
              <strong className={`stat-value status-${stats.game.status.toLowerCase()}`}>
                {stats.game.status}
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">DURATION</span>
              <strong className="stat-value">{stats.game.duration}</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">ROUNDS PLAYED</span>
              <strong className="stat-value">{stats.game.roundsPlayed}</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">QUESTIONS ASKED</span>
              <strong className="stat-value">{stats.game.questionsAsked}</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">WHEEL SPINS</span>
              <strong className="stat-value">{stats.game.wheelSpins}</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">ANNOUNCEMENTS</span>
              <strong className="stat-value">{stats.game.announcements}</strong>
            </div>
          </div>
        </section>

        {/* TEAM COMPARISON */}
        <section className="stats-section">
          <div className="stats-section-header">
            <i className="bi bi-people" aria-hidden="true" />
            <h3>TEAM PERFORMANCE</h3>
          </div>

          <div className="stats-teams-grid">
            {['A', 'B'].map((teamKey) => {
              const team = stats.teams[teamKey];
              return (
                <div key={teamKey} className="team-stat-box" style={{ '--team-col': team.color }}>
                  <div className="team-stat-header">
                    <span className="team-stat-badge">TEAM {teamKey}</span>
                    <h4 className="team-stat-name">{team.name}</h4>
                    <span className="team-stat-score">{team.currentScore} PTS</span>
                  </div>

                  <div className="team-stat-details">
                    <div className="team-stat-row">
                      <span>Points Gained / Lost:</span>
                      <strong>+{team.pointsGained} / -{team.pointsLost}</strong>
                    </div>
                    <div className="team-stat-row">
                      <span>Questions Answered:</span>
                      <strong>{team.questionsAnswered}</strong>
                    </div>
                    <div className="team-stat-row">
                      <span>Correct / Incorrect:</span>
                      <strong className="text-success">{team.correctAnswers}</strong> / <strong className="text-danger">{team.incorrectAnswers}</strong>
                    </div>
                    <div className="team-stat-row">
                      <span>Accuracy:</span>
                      <strong className="team-accuracy-pill">{team.accuracy}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="stats-dual-row">
          <section className="stats-section flex-1">
            <div className="stats-section-header">
              <i className="bi bi-patch-question" aria-hidden="true" />
              <h3>QUESTIONS METRICS</h3>
            </div>
            <div className="stats-detail-list">
              <div className="stats-detail-item">
                <span>Total Asked:</span>
                <strong>{stats.questions.asked}</strong>
              </div>
              <div className="stats-detail-item">
                <span>Correct Answers:</span>
                <strong className="text-success">{stats.questions.correct}</strong>
              </div>
              <div className="stats-detail-item">
                <span>Incorrect Answers:</span>
                <strong className="text-danger">{stats.questions.incorrect}</strong>
              </div>
              <div className="stats-detail-item">
                <span>Overall Accuracy:</span>
                <strong>{stats.questions.accuracy}</strong>
              </div>
              <div className="stats-detail-item">
                <span>Points Earned:</span>
                <strong>{stats.questions.pointsEarned}</strong>
              </div>
              <div className="stats-detail-item">
                <span>Avg Pts per Question:</span>
                <strong>{stats.questions.avgPointsPerQuestion}</strong>
              </div>
            </div>
          </section>

          {/* WHEEL */}
          <section className="stats-section flex-1">
            <div className="stats-section-header">
              <i className="bi bi-arrow-repeat" aria-hidden="true" />
              <h3>WHEEL METRICS</h3>
            </div>
            <div className="stats-detail-list">
              <div className="stats-detail-item">
                <span>Total Spins:</span>
                <strong>{stats.wheel.totalSpins}</strong>
              </div>
              <div className="stats-detail-item">
                <span>Most Common Result:</span>
                <strong>{stats.wheel.mostCommonResult}</strong>
              </div>
            </div>

            {Object.keys(stats.wheel.resultFrequency).length > 0 && (
              <div className="wheel-freq-chips">
                <span className="wheel-freq-label">Result Frequencies:</span>
                <div className="wheel-freq-list">
                  {Object.entries(stats.wheel.resultFrequency).map(([res, cnt]) => (
                    <span key={res} className="wheel-freq-tag">
                      {res} <span className="freq-count">x{cnt}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="stats-modal-footer">
          <Button variant="secondary" size="medium" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default GameStatsModal;
