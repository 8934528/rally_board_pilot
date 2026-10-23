import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function LandingPage() {
  useDocumentTitle('RBP');

  return (
    <div className="landing-shell" id="landing-shell">
      <div className="landing-hero">
        <div className="landing-logo">RBP</div>

        <h1 className="landing-title">
          Rally Board Pilot
        </h1>

        <p className="landing-tagline">
          Select control console or screen display
        </p>
      </div>

      <div className="landing-cards" role="navigation" aria-label="Role selector">
        <Link
          to="/controller"
          className="landing-card controller-card"
          id="landing-controller-link"
        >
          <div className="landing-card-icon">
            <i className="bi bi-sliders" />
          </div>

          <div className="landing-card-body">
            <div className="landing-card-title">
              Controller
            </div>

            <div className="landing-card-desc">
              Master control room. Set scores, teams, rounds, timer and board displays.
            </div>
          </div>

          <i className="bi bi-arrow-right landing-card-arrow" />
        </Link>

        <Link
          to="/host"
          className="landing-card host-card"
          id="landing-host-link"
        >
          <div className="landing-card-icon">
            <i className="bi bi-person-badge" />
          </div>

          <div className="landing-card-body">
            <div className="landing-card-title">
              Host
            </div>

            <div className="landing-card-desc">
              Fast live console with synchronized timer, wheel, rounds, and scoreboard.
            </div>
          </div>

          <i className="bi bi-arrow-right landing-card-arrow" />
        </Link>

        <Link
          to="/board"
          className="landing-card board-card"
          id="landing-board-link"
        >
          <div className="landing-card-icon">
            <i className="bi bi-display" />
          </div>

          <div className="landing-card-body">
            <div className="landing-card-title">
              Game Board
            </div>

            <div className="landing-card-desc">
              Dedicated full-screen display for broadcast, arena or live audience.
            </div>
          </div>

          <i className="bi bi-arrow-right landing-card-arrow" />
        </Link>

        <Link
          to="/activity"
          className="landing-card activity-card"
          id="landing-activity-link"
        >
          <div className="landing-card-icon">
            <i className="bi bi-clock-history" />
          </div>

          <div className="landing-card-body">
            <div className="landing-card-title">
              Activity History
            </div>

            <div className="landing-card-desc">
              Dedicated ScrollSpy log of all game events, score adjustments, and rounds.
            </div>
          </div>

          <i className="bi bi-arrow-right landing-card-arrow" />
        </Link>
      </div>

      <div className="landing-footer">
        RBP &mdash; Control System
      </div>
    </div>
  );
}

export default LandingPage;
