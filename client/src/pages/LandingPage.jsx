import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const SCREENS = [
  {
    icon: 'bi-display',
    title: 'Game Board',
    summary: 'The public screen for a TV, projector, or arena display.',
    points: [
      'Open it in a full-screen browser window: F11 on Windows, or Command + Control + F on Mac.',
      'It shows only the active board view, so the audience never sees operator controls.',
      'Keep it on the same network as the Controller so updates arrive instantly.'
    ]
  },
  {
    icon: 'bi-sliders',
    title: 'Controller',
    summary: 'The operator console on the main computer.',
    points: [
      'Set up teams, rounds, timer, wheel entries, questions, theme, and announcements here.',
      'Only the Controller can grant or revoke Host permissions and undo changes.',
      'Keep this window open for the whole session so the live connection stays active.'
    ]
  },
  {
    icon: 'bi-person-badge',
    title: 'Host',
    summary: 'An optional second device for a co-presenter.',
    points: [
      'Use a tablet or laptop when another person runs the live game.',
      'Only the controls the Controller has granted appear on the Host screen.',
      'Every change made from Host updates the Board and Controller in real time.'
    ]
  }
];

const STEPS = [
  {
    title: 'Open the Game Board',
    text: 'place it on the main display and make it full screen.'
  },
  {
    title: 'Open the Controller',
    text: 'on the operator computer, set team names and colors.'
  },
  {
    title: 'Prepare content before the audience sees it',
    text: 'load the timer duration, wheel entries, questions, and announcements.'
  },
  {
    title: 'Add a Host if needed',
    text: 'open HOST on a second device when a co-presenter runs the game.'
  },
  {
    title: 'Go live',
    text: 'press the Live button to start, the CONTROLLER can undo up to 50 steps.'
  }
];

const CHECKLIST = [
  'Start the server with npm run dev or make dev, then confirm the status dot is green on every screen.',
  'On other devices, replace localhost with the operator computer\u2019s network address.',
  'Run a short test: show an announcement, start the timer, switch to the wheel, then reset the game.',
  'Set Host permissions before the presenter takes over.'
];

const LAUNCH_SCREENS = [
  {
    to: '/controller',
    id: 'landing-controller-link',
    variant: 'controller',
    icon: 'bi-sliders',
    title: 'Controller',
    description: 'Full Operator Console'
  },
  {
    to: '/host',
    id: 'landing-host-link',
    variant: 'host',
    icon: 'bi-person-badge',
    title: 'Host',
    description: 'Live Game Console'
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
      <header className="lp-header" id="landing-hero">
        <div className="lp-brand">
          <div>
            <h3 className="lp-title">Rally Board Pilot</h3>
          </div>
        </div>

        <p className="lp-header-meta">Controller &middot; Host &middot; Game Board</p>
      </header>

      <main className="lp-main" id="landing-columns">
        <section className="lp-column lp-column--setup" aria-labelledby="lp-setup-title">
          <header className="lp-column-head">
            <span className="lp-column-number">01</span>
            <h2 id="lp-setup-title" className="lp-column-title">SET UP YOUR SCREENS</h2>
          </header>

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
            <ul className="lp-points">
              {CHECKLIST.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="lp-column lp-column--how" aria-labelledby="lp-how-title">
          <header className="lp-column-head">
            <span className="lp-column-number">02</span>
            <h2 id="lp-how-title" className="lp-column-title">HOW IT WORKS</h2>
          </header>

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

          <p className="lp-note">
            LIVE marks the game as running on the board. PAUSED marks it as on hold. Neither changes scores.
          </p>
        </section>

        <section className="lp-column lp-column--open" aria-labelledby="lp-open-title">
          <header className="lp-column-head">
            <span className="lp-column-number">03</span>
            <h2 id="lp-open-title" className="lp-column-title">OPEN A SCREEN</h2>
          </header>

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

          <p className="lp-note">
            Only the Controller can change Host permissions. Changes apply to every connected screen immediately
          </p>
        </section>
      </main>

      <footer className="lp-footer">
        <span>Rally Board Pilot</span>
      </footer>
    </div>
  );
}

export default LandingPage;
