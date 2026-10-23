import { formatScore } from '../../utils/formatScore';

function Scoreboard({ gameState }) {
  const teamA = gameState.teams.A;
  const teamB = gameState.teams.B;

  return (
    <section className="scoreboard">

      <article
        className="team-card team-a"
        style={{
          '--team-color': teamA.color
        }}
      >
        <div className="team-accent" />

        <div className="team-content">
          <span className="team-label">
            TEAM A
          </span>

          <h1>{teamA.name}</h1>

          <div className="score">
            {formatScore(teamA.score)}
          </div>
        </div>
      </article>

      <div className="versus">
        <span>VS</span>
      </div>

      <article
        className="team-card team-b"
        style={{
          '--team-color': teamB.color
        }}
      >
        <div className="team-accent" />

        <div className="team-content">
          <span className="team-label">
            TEAM B
          </span>

          <h1>{teamB.name}</h1>

          <div className="score">
            {formatScore(teamB.score)}
          </div>
        </div>
      </article>

    </section>
  );
}

export default Scoreboard;
