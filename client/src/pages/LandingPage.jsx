import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const SCREENS = [
  {
    icon: 'bi-display',
    title: 'Game Board',
    summary: 'Public screen for audience TV or projector display.',
    points: [
      'Full-screen view (F11)',
      'Real-time automated sync'
    ]
  },
  {
    icon: 'bi-sliders',
    title: 'Controller',
    summary: 'Main operator console on master computer.',
    points: [
      'Full game and team management',
      'Configures permissions and timers'
    ]
  },
  {
    icon: 'bi-person-badge',
    title: 'Host',
    summary: 'Co-presenter console for tablets or laptops.',
    points: [
      'Live handheld game execution',
      'Uses permissions set by Controller'
    ]
  }
];

const STEPS = [
  {
    title: 'Open Game Board',
    text: 'Show on audience screen in full screen mode.'
  },
  {
    title: 'Configure Controller',
    text: 'Set team names, timer length, and question decks.'
  },
  {
    title: 'Connect Host (Optional)',
    text: 'Launch Host on mobile/tablet for co-hosts.'
  },
  {
    title: 'Go Live',
    text: 'Click LIVE to run the game with full undo support.'
  }
];

const CHECKLIST = [
  'Verify server connection dot is green.',
  'Connect all devices to operator network.',
  'Test timer, wheel, and score controls.',
  'Confirm Host permissions before starting.'
];

const LAUNCH_SCREENS = [
  {
    to: '/controller',
    id: 'landing-controller-link',
    variant: 'controller',
    icon: 'bi-sliders',
    title: 'Controller',
    description: 'Operator Console'
  },
  {
    to: '/host',
    id: 'landing-host-link',
    variant: 'host',
    icon: 'bi-person-badge',
    title: 'Host',
    description: 'Co-Host Console'
  },
  {
    to: '/board',
    id: 'landing-board-link',
    variant: 'board',
    icon: 'bi-display',
    title: 'Game Board',
    description: 'Public Display'
  }
];

function LandingPage() {
  useDocumentTitle('Rally Board Pilot');

  return (
    <div className="lp-shell" id="landing-shell">
      <header className="lp-header" id="landing-header">
        <div className="lp-brand">
          <div className="lp-logo">RBP</div>
          <div className="lp-brand-info">
            <span className="lp-tagline">Game Control &amp; Scoreboard</span>
          </div>
        </div>
        <div className="lp-header-meta">
          <span className="lp-badge">CONTROLLER</span>
          <span className="lp-badge">HOST</span>
          <span className="lp-badge">GAME BOARD</span>
        </div>
      </header>

      <main className="lp-main-scroll" id="landing-main-scroll">
        <div className="lp-main-row" id="landing-columns">
          <section className="lp-column lp-column--setup" aria-labelledby="lp-setup-title">
            <div className="lp-column-head">
              <span className="lp-column-number">01</span>
              <h2 id="lp-setup-title" className="lp-column-title">SET UP SCREENS</h2>
            </div>

            <div className="lp-screen-list">
              {SCREENS.map((screen) => (
                <article key={screen.title} className="lp-screen">
                  <div className="lp-screen-icon">
                    <i className={`bi ${screen.icon}`} aria-hidden="true" />
                  </div>
                  <div className="lp-screen-body">
                    <h3 className="lp-screen-title">{screen.title}</h3>
                    <p className="lp-screen-summary">{screen.summary}</p>
                    <ul className="lp-points">
                      {screen.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <div className="lp-checklist-block">
              <h3 className="lp-subhead">BEFORE YOU GO LIVE</h3>
              <ul className="lp-checklist">
                {CHECKLIST.map((item) => (
                  <li key={item}>
                    <i className="bi bi-check2 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="lp-column lp-column--how" aria-labelledby="lp-how-title">
            <div className="lp-column-head">
              <span className="lp-column-number">02</span>
              <h2 id="lp-how-title" className="lp-column-title">HOW IT WORKS</h2>
            </div>

            <ol className="lp-steps">
              {STEPS.map((step, index) => (
                <li key={step.title} className="lp-step">
                  <span className="lp-step-num">{index + 1}</span>
                  <div className="lp-step-body">
                    <h3 className="lp-step-title">{step.title}</h3>
                    <p className="lp-step-text">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="lp-note">
              <i className="bi bi-info-circle-fill text-primary" />
              <span>LIVE marks the game active on the board; PAUSED holds play. Neither modifies scores.</span>
            </div>
          </section>

          <section className="lp-column lp-column--open" aria-labelledby="lp-open-title">
            <div className="lp-column-head">
              <span className="lp-column-number">03</span>
              <h2 id="lp-open-title" className="lp-column-title">OPEN A SCREEN</h2>
            </div>

            <nav className="lp-launch-list" aria-label="Open a screen">
              {LAUNCH_SCREENS.map((screen) => (
                <Link
                  key={screen.id}
                  to={screen.to}
                  id={screen.id}
                  className={`lp-launch lp-launch--${screen.variant}`}
                >
                  <span className="lp-launch-icon">
                    <i className={`bi ${screen.icon}`} aria-hidden="true" />
                  </span>
                  <span className="lp-launch-body">
                    <span className="lp-launch-title">{screen.title}</span>
                    <span className="lp-launch-desc">{screen.description}</span>
                  </span>
                  <i className="bi bi-arrow-right lp-launch-arrow" aria-hidden="true" />
                </Link>
              ))}
            </nav>

            <div className="lp-note">
              <i className="bi bi-shield-check text-primary" />
              <span>Only the Controller manages Host permissions, syncing instantly across devices.</span>
            </div>
          </section>
        </div>
      </main>

      <footer className="lp-footer" id="landing-footer">
        <span className="lp-footer-brand">Rally Board Pilot &bull; Controller &bull; Host &bull; Game Board</span>
        <span className="lp-footer-meta">Live Event Production Console</span>
      </footer>
    </div>
  );
}

export default LandingPage;
