export const defaultGameState = {
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
export const defaultGameState = {
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

  timer: {
    running: false,
    seconds: 30,
    total: 30
  },

  wheel: {
    entries: [
      'Bonus Round',
      'Double Points',
      'Challenge',
      'Steal',
      'Wildcard',
      'Extra Turn'
    ],
    spinning: false,
    result: null,
    winnerIndex: null
  },

  announcement: {
    text: '',
    title: '',
    visible: false
  },

  winner: {
    team: null,
    message: 'Congratulations!'
  },

  meta: {
    lastAction: null,
    lastActionAt: null,
    revision: 0
  }
};
