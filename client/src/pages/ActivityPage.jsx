import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import FullscreenButton from '../components/common/FullscreenButton';
import ConnectionStatus from '../components/common/ConnectionStatus';
import SoundToggle from '../components/common/SoundToggle';
import { deriveGameStats } from '../utils/statsDeriver';

const CATEGORIES = [
  { id: 'all', label: 'All Activities', icon: 'list-ul' },
  { id: 'score', label: 'Scores', icon: 'trophy' },
  { id: 'round', label: 'Rounds', icon: 'diagram-3' },
  { id: 'timer', label: 'Timer & Clock', icon: 'stopwatch' },
  { id: 'wheel', label: 'Wheel', icon: 'pie-chart' },
  { id: 'system', label: 'System & Status', icon: 'gear' }
];

function ActivityPage() {
  useDocumentTitle('RBP - ACTIVITY & STATS');
  const { gameState, connected } = useGame();

  const [viewMode, setViewMode] = useState('log'); // 'log' | 'stats'
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSpySection, setActiveSpySection] = useState('all');
  const scrollContainerRef = useRef(null);

  const stats = deriveGameStats(gameState);
  const activities = gameState?.activities || [];

  const filteredActivities = activities.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // Group activities by category for the ScrollSpy view
  const scoreEvents = activities.filter((i) => i.category === 'score');
  const roundEvents = activities.filter((i) => i.category === 'round');
  const timerEvents = activities.filter((i) => i.category === 'timer' || i.category === 'wheel');
  const systemEvents = activities.filter((i) => i.category === 'system' || i.category === 'team' || i.category === 'board');

  // ScrollSpy observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || viewMode !== 'log') return;

    const sections = container.querySelectorAll('.activity-spy-section');
    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let currentSectionId = 'all';

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top - containerTop <= 120) {
          currentSectionId = sec.getAttribute('data-section-id');
        }
      });

      if (currentSectionId) {
        setActiveSpySection(currentSectionId);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const scrollToSection = (sectionId) => {
    setViewMode('log');
    setActiveCategory('all');
    const container = scrollContainerRef.current;
    if (!container) return;
    const target = container.querySelector(`[data-section-id="${sectionId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'score': return 'bi-trophy-fill text-warning';
      case 'round': return 'bi-diagram-3-fill text-primary';
      case 'timer': return 'bi-stopwatch-fill text-info';
      case 'wheel': return 'bi-pie-chart-fill text-success';
      case 'team': return 'bi-people-fill text-danger';
      case 'system':
      default: return 'bi-shield-check text-secondary';
    }
  };

  return (
    <div className="activity-page-shell" id="activity-page-root">
      <header className="activity-topbar">
        <div className="activity-topbar-left">
          <Link to="/controller" className="activity-back-btn" title="Back to Controller">
            <i className="bi bi-arrow-left" />
            <span>CONTROLLER</span>
          </Link>
          <div className="activity-page-title">
            <span>ACTIVITY & STATS</span>
          </div>

          <div className="activity-view-tabs" role="tablist">
            <button
              type="button"
              className={`activity-view-tab-btn ${viewMode === 'log' ? 'active' : ''}`}
              onClick={() => setViewMode('log')}
              id="tab-view-log"
            >
              <i className="bi bi-list-ul" />
              <span>Activity Log</span>
            </button>
            <button
              type="button"
              className={`activity-view-tab-btn ${viewMode === 'stats' ? 'active' : ''}`}
              onClick={() => setViewMode('stats')}
              id="tab-view-stats"
            >
              <i className="bi bi-graph-up" />
              <span>Game Stats</span>
            </button>
          </div>
        </div>

        <div className="activity-topbar-right">
          <SoundToggle id="activity-sound-toggle" />
          <ConnectionStatus connected={connected} dotOnly={true} />
          <FullscreenButton />
        </div>
      </header>

      <div className="activity-content-layout">
        <nav className="activity-scrollspy-sidebar" aria-label="Activity sections">
          <div className="scrollspy-header">
            <span>ACTIVITY CATEGORIES</span>
          </div>

          <div className="scrollspy-nav-links">
            {CATEGORIES.map((cat) => {
              const isActive = activeSpySection === cat.id;
              const count = cat.id === 'all'
                ? activities.length
                : activities.filter((i) => i.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`scrollspy-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => scrollToSection(cat.id)}
                >
                  <i className={`bi bi-${cat.icon}`} />
                  <span className="scrollspy-label">{cat.label}</span>
                  <span className="scrollspy-badge">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="scrollspy-meta-card">
            <div className="meta-row">
              <span>Total Recorded</span>
              <strong>{activities.length}</strong>
            </div>
            <div className="meta-row">
              <span>Current Round</span>
              <strong>R{gameState?.round?.number || 1}</strong>
            </div>
          </div>
        </nav>

        <main
          ref={scrollContainerRef}
          className="activity-feed-container activity-history"
          id="activity-feed-container"
        >
          {viewMode === 'stats' ? (
            <div className="activity-stats-view-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>
              <section className="stats-section">
                <div className="stats-section-header">
                  <i className="bi bi-speedometer2" aria-hidden="true" />
                  <h3>GAME OVERVIEW</h3>
                </div>
                <div className="stats-overview-grid">
                  <div className="stat-card">
                    <span className="stat-label">STATUS</span>
                    <strong className={`stat-value status-${stats?.game?.status?.toLowerCase()}`}>{stats?.game?.status}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">DURATION</span>
                    <strong className="stat-value">{stats?.game?.duration}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">ROUNDS PLAYED</span>
                    <strong className="stat-value">{stats?.game?.roundsPlayed}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">QUESTIONS ASKED</span>
                    <strong className="stat-value">{stats?.game?.questionsAsked}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">WHEEL SPINS</span>
                    <strong className="stat-value">{stats?.game?.wheelSpins}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">ANNOUNCEMENTS</span>
                    <strong className="stat-value">{stats?.game?.announcements}</strong>
                  </div>
                </div>
              </section>

              <section className="stats-section">
                <div className="stats-section-header">
                  <i className="bi bi-people" aria-hidden="true" />
                  <h3>TEAM PERFORMANCE</h3>
                </div>
                <div className="stats-teams-grid">
                  {['A', 'B'].map((teamKey) => {
                    const team = stats?.teams?.[teamKey] || {};
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
                      <strong>{stats?.questions?.asked}</strong>
                    </div>
                    <div className="stats-detail-item">
                      <span>Correct Answers:</span>
                      <strong className="text-success">{stats?.questions?.correct}</strong>
                    </div>
                    <div className="stats-detail-item">
                      <span>Incorrect Answers:</span>
                      <strong className="text-danger">{stats?.questions?.incorrect}</strong>
                    </div>
                    <div className="stats-detail-item">
                      <span>Overall Accuracy:</span>
                      <strong>{stats?.questions?.accuracy}</strong>
                    </div>
                    <div className="stats-detail-item">
                      <span>Points Earned:</span>
                      <strong>{stats?.questions?.pointsEarned}</strong>
                    </div>
                    <div className="stats-detail-item">
                      <span>Avg Pts per Question:</span>
                      <strong>{stats?.questions?.avgPointsPerQuestion}</strong>
                    </div>
                  </div>
                </section>

                <section className="stats-section flex-1">
                  <div className="stats-section-header">
                    <i className="bi bi-arrow-repeat" aria-hidden="true" />
                    <h3>WHEEL METRICS</h3>
                  </div>
                  <div className="stats-detail-list">
                    <div className="stats-detail-item">
                      <span>Total Spins:</span>
                      <strong>{stats?.wheel?.totalSpins}</strong>
                    </div>
                    <div className="stats-detail-item">
                      <span>Most Common Result:</span>
                      <strong>{stats?.wheel?.mostCommonResult}</strong>
                    </div>
                  </div>
                  {stats?.wheel?.resultFrequency && Object.keys(stats.wheel.resultFrequency).length > 0 && (
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
            </div>
          ) : (
            <>
              <section
                className="activity-spy-section"
                data-section-id="all"
                id="section-all"
              >
            <div className="section-sticky-header">
              <i className="bi bi-clock-history" />
              <h2>LIVE ACTIVITY FEED</h2>
              <span className="feed-count">{filteredActivities.length} events</span>
            </div>

            {filteredActivities.length === 0 ? (
              <div className="activity-empty-card">
                <i className="bi bi-inbox" />
                <p>No actions logged in this category yet.</p>
              </div>
            ) : (
              <div className="activity-timeline-list">
                {filteredActivities.map((item) => (
                  <article key={item.id} className="activity-card-item">
                    <div className="activity-card-icon">
                      <i className={`bi ${getCategoryIcon(item.category)}`} />
                    </div>
                    <div className="activity-card-body">
                      <p className="activity-card-message">{item.message}</p>
                      <div className="activity-card-meta">
                        <span className="activity-tag">{(item.category || 'general').toUpperCase()}</span>
                        <time className="activity-time">{item.time}</time>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section
            className="activity-spy-section"
            data-section-id="round"
            id="section-rounds"
          >
            <div className="section-sticky-header">
              <i className="bi bi-diagram-3" />
              <h2>ROUND ADVANCEMENTS</h2>
              <span className="feed-count">{roundEvents.length} events</span>
            </div>
            {roundEvents.length === 0 ? (
              <div className="activity-empty-card">
                <p>No round changes recorded yet.</p>
              </div>
            ) : (
              <div className="activity-timeline-list">
                {roundEvents.map((item) => (
                  <article key={item.id} className="activity-card-item">
                    <div className="activity-card-icon">
                      <i className="bi bi-diagram-3-fill text-primary" />
                    </div>
                    <div className="activity-card-body">
                      <p className="activity-card-message">{item.message}</p>
                      <time className="activity-time">{item.time}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section
            className="activity-spy-section"
            data-section-id="score"
            id="section-scores"
          >
            <div className="section-sticky-header">
              <i className="bi bi-trophy" />
              <h2>SCORE ADJUSTMENTS</h2>
              <span className="feed-count">{scoreEvents.length} events</span>
            </div>
            {scoreEvents.length === 0 ? (
              <div className="activity-empty-card">
                <p>No score adjustments recorded yet.</p>
              </div>
            ) : (
              <div className="activity-timeline-list">
                {scoreEvents.map((item) => (
                  <article key={item.id} className="activity-card-item">
                    <div className="activity-card-icon">
                      <i className="bi bi-trophy-fill text-warning" />
                    </div>
                    <div className="activity-card-body">
                      <p className="activity-card-message">{item.message}</p>
                      <time className="activity-time">{item.time}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section
            className="activity-spy-section"
            data-section-id="timer"
            id="section-timer"
          >
            <div className="section-sticky-header">
              <i className="bi bi-stopwatch" />
              <h2>TIMER & WHEEL EVENTS</h2>
              <span className="feed-count">{timerEvents.length} events</span>
            </div>
            {timerEvents.length === 0 ? (
              <div className="activity-empty-card">
                <p>No timer or wheel operations recorded yet.</p>
              </div>
            ) : (
              <div className="activity-timeline-list">
                {timerEvents.map((item) => (
                  <article key={item.id} className="activity-card-item">
                    <div className="activity-card-icon">
                      <i className="bi bi-stopwatch-fill text-info" />
                    </div>
                    <div className="activity-card-body">
                      <p className="activity-card-message">{item.message}</p>
                      <time className="activity-time">{item.time}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section
            className="activity-spy-section"
            data-section-id="system"
            id="section-system"
          >
            <div className="section-sticky-header">
              <i className="bi bi-gear" />
              <h2>SYSTEM & CONTROL ROOM</h2>
              <span className="feed-count">{systemEvents.length} events</span>
            </div>
            {systemEvents.length === 0 ? (
              <div className="activity-empty-card">
                <p>No system changes recorded yet.</p>
              </div>
            ) : (
              <div className="activity-timeline-list">
                {systemEvents.map((item) => (
                  <article key={item.id} className="activity-card-item">
                    <div className="activity-card-icon">
                      <i className="bi bi-shield-check text-secondary" />
                    </div>
                    <div className="activity-card-body">
                      <p className="activity-card-message">{item.message}</p>
                      <time className="activity-time">{item.time}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ActivityPage;
