import { useEffect, useState } from 'react';

import { useSocket } from '../hooks/useSocket';

const initialGameState = {
  status: 'READY',

  round: {
    number: 1,
    name: 'Opening Round'
  },

  teams: {
    A: {
      name: 'Team A',
      score: 0,
      color: '#FF4D6D'
    },

    B: {
      name: 'Team B',
      score: 0,
      color: '#4D7CFE'
    }
  },

  board: {
    activePage: 'scoreboard',

    theme: {
      type: 'gradient',
      primary: '#141E30',
      secondary: '#243B55',
      direction: '135deg'
    }
  }
};

function ControllerPage() {
  const { socket, connected } = useSocket();

  const [gameState, setGameState] = useState(initialGameState);

  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');

  const [teamAColor, setTeamAColor] = useState('#FF4D6D');
  const [teamBColor, setTeamBColor] = useState('#4D7CFE');

  const [roundNumber, setRoundNumber] = useState(1);
  const [roundName, setRoundName] = useState('Opening Round');

  useEffect(() => {
    const handleGameStateUpdate = (state) => {
      setGameState(state);

      setTeamAName(state.teams.A.name);
      setTeamBName(state.teams.B.name);

      setTeamAColor(state.teams.A.color);
      setTeamBColor(state.teams.B.color);

      setRoundNumber(state.round.number);
      setRoundName(state.round.name);
    };

    socket.on('game:state:update', handleGameStateUpdate);

    if (socket.connected) {
      socket.emit('game:state:request');
    }

    return () => {
      socket.off('game:state:update', handleGameStateUpdate);
    };
  }, [socket]);

  const changeScore = (team, points) => {
    const event =
      points >= 0
        ? 'game:score:add'
        : 'game:score:subtract';

    socket.emit(event, {
      team,
      points: Math.abs(points)
    });
  };

  const updateTeam = (team) => {
    socket.emit('game:team:update', {
      team,
      name:
        team === 'A'
          ? teamAName
          : teamBName,
      color:
        team === 'A'
          ? teamAColor
          : teamBColor
    });
  };

  const updateRound = () => {
    socket.emit('game:round:update', {
      number: Number(roundNumber),
      name: roundName
    });
  };

  const changeBoardPage = (page) => {
    socket.emit('game:board:page', {
      page
    });
  };

  const setGameStatus = (status) => {
    socket.emit('game:status:update', {
      status
    });
  };

  return (
    <div className="controller-shell">

      <header className="controller-topbar">

        <div className="controller-brand">
          <div className="controller-logo">
            RBP
          </div>

          <div>
            <div className="controller-title">
              RALLY BOARD PILOT
            </div>

            <div className="controller-subtitle">
              GAME CONTROL
            </div>
          </div>
        </div>

        <div className="controller-status">
          <span
            className={`controller-status-dot ${
              connected ? 'online' : 'offline'
            }`}
          />

          <span>
            {connected
              ? 'SERVER CONNECTED'
              : 'SERVER OFFLINE'}
          </span>
        </div>

      </header>

      <div className="controller-layout">

        <aside className="controller-sidebar">

          <div className="sidebar-section">
            <div className="sidebar-heading">
              BOARD
            </div>

            <button
              className={
                gameState.board.activePage === 'scoreboard'
                  ? 'sidebar-button active'
                  : 'sidebar-button'
              }
              onClick={() => changeBoardPage('scoreboard')}
            >
              <span>▣</span>
              Scoreboard
            </button>

            <button
              className={
                gameState.board.activePage === 'round'
                  ? 'sidebar-button active'
                  : 'sidebar-button'
              }
              onClick={() => changeBoardPage('round')}
            >
              <span>◉</span>
              Round Intro
            </button>

            <button
              className={
                gameState.board.activePage === 'timer'
                  ? 'sidebar-button active'
                  : 'sidebar-button'
              }
              onClick={() => changeBoardPage('timer')}
            >
              <span>◷</span>
              Timer
            </button>

            <button
              className={
                gameState.board.activePage === 'wheel'
                  ? 'sidebar-button active'
                  : 'sidebar-button'
              }
              onClick={() => changeBoardPage('wheel')}
            >
              <span>◎</span>
              Spin Wheel
            </button>

            <button
              className={
                gameState.board.activePage === 'announcement'
                  ? 'sidebar-button active'
                  : 'sidebar-button'
              }
              onClick={() => changeBoardPage('announcement')}
            >
              <span>◆</span>
              Announcement
            </button>

            <button
              className={
                gameState.board.activePage === 'winner'
                  ? 'sidebar-button active'
                  : 'sidebar-button'
              }
              onClick={() => changeBoardPage('winner')}
            >
              <span>★</span>
              Winner
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-heading">
              GAME STATUS
            </div>

            <button
              className="status-control ready"
              onClick={() => setGameStatus('READY')}
            >
              READY
            </button>

            <button
              className="status-control live"
              onClick={() => setGameStatus('LIVE')}
            >
              LIVE
            </button>

            <button
              className="status-control paused"
              onClick={() => setGameStatus('PAUSED')}
            >
              PAUSED
            </button>

            <button
              className="status-control finished"
              onClick={() => setGameStatus('FINISHED')}
            >
              FINISHED
            </button>
          </div>

        </aside>

        <main className="controller-main">

          <div className="controller-page-heading">

            <div>
              <div className="eyebrow">
                CONTROL ROOM
              </div>

              <h1>
                Live Game Control
              </h1>

              <p>
                Everything you change here is pushed
                live to the Game Board.
              </p>
            </div>

            <div className="active-page-indicator">
              <span>ON AIR</span>
              <strong>
                {gameState.board.activePage.toUpperCase()}
              </strong>
            </div>

          </div>

          <section className="control-grid">

            {/* TEAM A */}

            <article className="control-card">

              <div className="control-card-header">

                <div>
                  <span className="team-badge team-a-badge">
                    TEAM A
                  </span>

                  <h2>
                    {gameState.teams.A.name}
                  </h2>
                </div>

                <div
                  className="color-preview"
                  style={{
                    backgroundColor:
                      gameState.teams.A.color
                  }}
                />
              </div>

              <div className="live-score">
                {gameState.teams.A.score}
              </div>

              <div className="score-buttons">

                <button
                  className="score-button minus"
                  onClick={() => changeScore('A', -1)}
                >
                  −1
                </button>

                <button
                  className="score-button minus"
                  onClick={() => changeScore('A', -5)}
                >
                  −5
                </button>

                <button
                  className="score-button major"
                  onClick={() => changeScore('A', -10)}
                >
                  −10
                </button>

                <button
                  className="score-button plus"
                  onClick={() => changeScore('A', 1)}
                >
                  +1
                </button>

                <button
                  className="score-button plus"
                  onClick={() => changeScore('A', 5)}
                >
                  +5
                </button>

                <button
                  className="score-button major"
                  onClick={() => changeScore('A', 10)}>
                  +10
                </button>

              </div>

              <div className="team-settings">

                <label>
                  Team Name
                </label>

                <input
                  value={teamAName}
                  onChange={(event) =>
                    setTeamAName(event.target.value)
                  }
                  onBlur={() => updateTeam('A')}/>

                <label>
                  Team Colour
                </label>

                <div className="color-input-row">

                  <input
                    type="color"
                    value={teamAColor}
                    onChange={(event) => {
                      setTeamAColor(event.target.value);

                      setTimeout(() => {
                        socket.emit(
                          'game:team:update',
                          {
                            team: 'A',
                            name: teamAName,
                            color: event.target.value
                          }
                        );
                      }, 0);
                    }}/>

                  <span>
                    {teamAColor}
                  </span>

                </div>

              </div>

            </article>

            {/* TEAM B */}

            <article className="control-card">

              <div className="control-card-header">

                <div>
                  <span className="team-badge team-b-badge">
                    TEAM B
                  </span>

                  <h2>
                    {gameState.teams.B.name}
                  </h2>
                </div>

                <div
                  className="color-preview"
                  style={{
                    backgroundColor:
                      gameState.teams.B.color
                  }}/>
              </div>

              <div className="live-score">
                {gameState.teams.B.score}
              </div>

              <div className="score-buttons">

                <button
                  className="score-button minus"
                  onClick={() => changeScore('B', -1)}>
                  −1
                </button>

                <button
                  className="score-button minus"
                  onClick={() => changeScore('B', -5)}>
                  −5
                </button>

                <button
                  className="score-button major"
                  onClick={() => changeScore('B', -10)}>
                  −10
                </button>

                <button
                  className="score-button plus"
                  onClick={() => changeScore('B', 1)}>
                  +1
                </button>

                <button
                  className="score-button plus"
                  onClick={() => changeScore('B', 5)}>
                  +5
                </button>

                <button
                  className="score-button major"
                  onClick={() => changeScore('B', 10)}>
                  +10
                </button>

              </div>

              <div className="team-settings">

                <label>
                  Team Name
                </label>

                <input
                  value={teamBName}
                  onChange={(event) =>
                    setTeamBName(event.target.value)
                  }
                  onBlur={() => updateTeam('B')}/>

                <label>
                  Team Colour
                </label>

                <div className="color-input-row">

                  <input
                    type="color"
                    value={teamBColor}
                    onChange={(event) => {
                      setTeamBColor(event.target.value);

                      setTimeout(() => {
                        socket.emit(
                          'game:team:update',
                          {
                            team: 'B',
                            name: teamBName,
                            color: event.target.value
                          }
                        );
                      }, 0);
                    }}/>

                  <span>
                    {teamBColor}
                  </span>

                </div>

              </div>

            </article>

          </section>

          {/* ROUND CONTROL */}

          <section className="wide-control-card">

            <div className="wide-card-heading">

              <div>
                <div className="eyebrow">
                  ROUND DIRECTOR
                </div>

                <h2>
                  Round Configuration
                </h2>
              </div>

              <div className="round-live-number">
                ROUND {gameState.round.number}
              </div>

            </div>

            <div className="round-controls">

              <div className="field">

                <label>
                  Round Number
                </label>

                <input
                  type="number"
                  min="1"
                  value={roundNumber}
                  onChange={(event) =>
                    setRoundNumber(event.target.value)
                  }/>

              </div>

              <div className="field">

                <label>
                  Round Name
                </label>

                <input
                  value={roundName}
                  onChange={(event) =>
                    setRoundName(event.target.value)
                  }/>

              </div>

              <button
                className="primary-action"
                onClick={updateRound}>
                UPDATE ROUND
              </button>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default ControllerPage;
