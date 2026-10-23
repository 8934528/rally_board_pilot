import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-shell">

      <div className="landing-hero">

        <div className="landing-logo">RBP</div>

        <h1 className="landing-title">
          Rally Board Pilot
        </h1>

        <p className="landing-tagline">
          Pick your role to get started
        </p>

      </div>

      <div className="landing-cards">

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
              Full control of the game. Set scores, teams, rounds and board pages.
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
              Simple controls for the person running the game live.
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
              Public display for players and the audience. Put this on a big screen.
            </div>
          </div>

          <i className="bi bi-arrow-right landing-card-arrow" />
        </Link>

      </div>

      <div className="landing-footer">
        RBP &mdash; Game Control System
      </div>

    </div>
  );
}

export default LandingPage;
