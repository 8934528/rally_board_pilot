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
  },

  wheel: {
    entries: [],
    spinning: false,
    result: null
  },

  timer: {
    running: false,
    seconds: 30
  },

  announcement: {
    text: '',
    visible: false
  }
};

function BoardPage() {
  const { socket, connected } = useSocket();

  const [gameState, setGameState] = useState(initialGameState);

  useEffect(() => {
    const handleGameStateUpdate = (state) => {
      setGameState(state);
    };

    socket.on('game:state:update', handleGameStateUpdate);

    if (socket.connected) {
      socket.emit('game:state:request');
    }

    return () => {
      socket.off('game:state:update', handleGameStateUpdate);
    };
  }, [socket]);

  const teamA = gameState.teams.A;
  const teamB = gameState.teams.B;
  const theme = gameState.board.theme;

  const boardStyle = {
    '--team-a-color': teamA.color,
    '--team-b-color': teamB.color,
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-direction': theme.direction
  };

  return (
    <main
      className="rally-board"
      style={boardStyle}
    >
      <header className="board-header">
        <div>
          <div className="brand-mark">
            RALLY BOARD
          </div>

          <div className="brand-subtitle">
            PILOT
          </div>
        </div>

        <div className="round-display">
          <span className="round-label">
            ROUND {gameState.round.number}
          </span>

          <span className="round-name">
            {gameState.round.name}
          </span>
        </div>

        <div className="live-indicator">
          <span
            className={`status-dot ${
              connected ? 'online' : 'offline'
            }`}
          />

          <span>
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </header>

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
              {teamA.score}
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
              {teamB.score}
            </div>
          </div>
        </article>
      </section>

      <footer className="board-footer">
        <div className="game-status">
          {gameState.status}
        </div>

        <div className="footer-center">
          RALLY BOARD PILOT
        </div>

        <div className="connection-status">
          {connected
            ? 'CONNECTED'
            : 'WAITING FOR CONNECTION'}
        </div>
      </footer>
    </main>
  );
}

export default BoardPage;
