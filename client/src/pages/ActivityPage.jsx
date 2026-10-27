import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import FullscreenButton from '../components/common/FullscreenButton';
import ConnectionStatus from '../components/common/ConnectionStatus';

const CATEGORIES = [
  { id: 'all', label: 'All Activities', icon: 'list-ul' },
  { id: 'score', label: 'Scores', icon: 'trophy' },
  { id: 'round', label: 'Rounds', icon: 'diagram-3' },
  { id: 'timer', label: 'Timer & Clock', icon: 'stopwatch' },
  { id: 'wheel', label: 'Wheel', icon: 'pie-chart' },
  { id: 'system', label: 'System & Status', icon: 'gear' }
];

function ActivityPage() {
  useDocumentTitle('RBP - ACTIVITY');
  const { gameState, connected } = useGame();

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSpySection, setActiveSpySection] = useState('all');
  const scrollContainerRef = useRef(null);

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
    if (!container) return;

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
  }, []);

  const scrollToSection = (sectionId) => {
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
            <span>ACTIVITY</span>
          </div>
        </div>

        <div className="activity-topbar-right">
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
        </main>
      </div>
    </div>
  );
}

export default ActivityPage;
