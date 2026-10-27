import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function LandingPage() {
  useDocumentTitle('Rally Board Pilot');

  return (
    <div className="landing-shell" id="landing-shell">
      <header className="landing-hero" id="landing-hero">
        <h1 className="landing-title">Rally Board Pilot</h1>
        <p className="landing-tagline">
          Live Game Control and Scoreboard System
        </p>
      </header>

      <main className="landing-columns-container" id="landing-columns">
        <section className="landing-column" id="landing-col-how-it-works">
          <div className="landing-col-header">
            <span className="landing-col-number">01</span>
            <h2 className="landing-col-title">HOW IT WORKS</h2>
          </div>

          <div className="landing-workflow-steps">
            <div className="workflow-step">
              <span className="step-num">1</span>
              <div className="step-content">
                <p>Open the Game Board on the main display.</p>
              </div>
            </div>

            <div className="workflow-step">
              <span className="step-num">2</span>
              <div className="step-content">
                <p>Open Controller on the operator computer.</p>
              </div>
            </div>

            <div className="workflow-step">
              <span className="step-num">3</span>
              <div className="step-content">
                <p>Set up teams and game settings.</p>
              </div>
            </div>

            <div className="workflow-step">
              <span className="step-num">4</span>
              <div className="step-content">
                <p>Open Host if another person is running the live game.</p>
              </div>
            </div>

            <div className="workflow-step">
              <span className="step-num">5</span>
              <div className="step-content">
                <p>Start the game.</p>
              </div>
            </div>
          </div>
        </section>



        <section className="landing-column" id="landing-col-setup-screens">
          <div className="landing-col-header">
            <span className="landing-col-number">02</span>
            <h2 className="landing-col-title">SET UP YOUR SCREENS</h2>
          </div>

          <div className="screen-setup-list">
            <article className="screen-setup-item">
              <div className="screen-setup-heading">
                <i className="bi bi-display" aria-hidden="true" />
                <h3>Game Board</h3>
              </div>
              <ul className="screen-setup-points">
                <li>Use on the TV, projector or audience display.</li>
                <li>This is the public-facing screen.</li>
              </ul>
            </article>

            <article className="screen-setup-item">
              <div className="screen-setup-heading">
                <i className="bi bi-sliders" aria-hidden="true" />
                <h3>Controller</h3>
              </div>
              <ul className="screen-setup-points">
                <li>Use on the main operator computer.</li>
                <li>This is where the full game is configured.</li>
              </ul>
            </article>

            <article className="screen-setup-item">
              <div className="screen-setup-heading">
                <i className="bi bi-person-badge" aria-hidden="true" />
                <h3>Host</h3>
              </div>
              <ul className="screen-setup-points">
                <li>Use on a second computer/tablet when another person is running the live game.</li>
                <li>Host access depends on the permissions configured by the Controller.</li>
              </ul>
            </article>
          </div>
        </section>


        <section className="landing-column" id="landing-col-open-screen">
          <div className="landing-col-header">
            <span className="landing-col-number">03</span>
            <h2 className="landing-col-title">OPEN A SCREEN</h2>
          </div>

          <nav className="landing-screen-links" aria-label="Primary navigation">
            <Link
              to="/controller"
              className="landing-screen-card controller-card"
              id="landing-controller-link"
            >
              <div className="landing-card-icon">
                <i className="bi bi-sliders" aria-hidden="true" />
              </div>
              <div className="landing-card-body">
                <div className="landing-card-title">Controller</div>
                <div className="landing-card-desc">
                  Full operator console for scores, timers, questions, and displays.
                </div>
              </div>
              <i className="bi bi-arrow-right landing-card-arrow" aria-hidden="true" />
            </Link>

            <Link
              to="/host"
              className="landing-screen-card host-card"
              id="landing-host-link"
            >
              <div className="landing-card-icon">
                <i className="bi bi-person-badge" aria-hidden="true" />
              </div>
              <div className="landing-card-body">
                <div className="landing-card-title">Host</div>
                <div className="landing-card-desc">
                  Live game console with permission-controlled actions.
                </div>
              </div>
              <i className="bi bi-arrow-right landing-card-arrow" aria-hidden="true" />
            </Link>

            <Link
              to="/board"
              className="landing-screen-card board-card"
              id="landing-board-link"
            >
              <div className="landing-card-icon">
                <i className="bi bi-display" aria-hidden="true" />
              </div>
              <div className="landing-card-body">
                <div className="landing-card-title">Game Board</div>
                <div className="landing-card-desc">
                  Public display for audience, arena screens, or projector.
                </div>
              </div>
              <i className="bi bi-arrow-right landing-card-arrow" aria-hidden="true" />
            </Link>
          </nav>
        </section>
      </main>

      <footer className="landing-footer">
        <span>Rally Board Pilot</span> &bull; <span>Production Ready Live Game System</span>
      </footer>
    </div>
  );
}

export default LandingPage;
