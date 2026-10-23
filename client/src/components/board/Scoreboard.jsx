import { formatScore } from '../../utils/formatScore';

function Scoreboard({ gameState }) {
  const teamA = gameState.teams.A;
  const teamB = gameState.teams.B;

  return (
    <section className="board-scoreboard-fullscreen" id="board-scoreboard">
      <article
        className="board-team-card board-team-a"
        style={{
          '--team-color': teamA.color
        }}
      >
        <div className="board-team-inner">
          <span className="board-team-badge">TEAM A</span>
          <h1 className="board-team-name">{teamA.name}</h1>
          <div className="board-score-number" id="board-score-a">
            {formatScore(teamA.score)}
          </div>
        </div>
      </article>

      <div className="board-vs-divider" aria-hidden="true">
        <span className="vs-badge">VS</span>
      </div>

      <article
        className="board-team-card board-team-b"
        style={{
          '--team-color': teamB.color
        }}
      >
        <div className="board-team-inner">
          <span className="board-team-badge">TEAM B</span>
          <h1 className="board-team-name">{teamB.name}</h1>
          <div className="board-score-number" id="board-score-b">
            {formatScore(teamB.score)}
          </div>
        </div>
      </article>
    </section>
  );
}

export default Scoreboard;
