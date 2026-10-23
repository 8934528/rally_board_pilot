const gameState = {
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

export function getGameState() {
  return gameState;
}

export function updateGameState(updater) {
  updater(gameState);

  return gameState;
}
