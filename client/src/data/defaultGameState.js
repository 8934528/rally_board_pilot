export const DEFAULT_HOST_PERMISSIONS = {
  score: true,
  round: true,
  status: true,
  timer: true,
  wheel: true,
  team: false,
  theme: false,
  announcement: false,
  winner: false,
  reset: false,
  wheelConfig: false,
  questions: false
};

export const defaultGameState = {
  status: 'READY',

  round: {
    number: 1,
    name: 'Opening Round'
  },

  roundTransition: {
    active: false,
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
      'Add a point',
      'Extra turn',
      'Deduct a point',
      'Steal',
      'Add two points',
      'Wildcard',
      'Deduct two points'
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

  question: {
    current: null,
    status: 'idle',
    lastResult: null,
    history: []
  },

  hostPermissions: { ...DEFAULT_HOST_PERMISSIONS },

  activities: [
    {
      id: 'init-1',
      message: 'System initialized in READY state',
      category: 'system',
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString()
    }
  ],

  stats: {
    game: {
      startedAt: null,
      rounds: 0,
      questionsAsked: 0,
      wheelSpins: 0,
      announcements: 0
    },
    teams: {
      A: { pointsGained: 0, pointsLost: 0, questionsCorrect: 0, questionsIncorrect: 0 },
      B: { pointsGained: 0, pointsLost: 0, questionsCorrect: 0, questionsIncorrect: 0 }
    },
    wheel: {
      totalSpins: 0,
      results: {}
    },
    questions: {
      asked: 0,
      correct: 0,
      incorrect: 0,
      pointsEarned: 0
    }
  },

  meta: {
    lastAction: 'System ready',
    lastActionAt: new Date().toISOString(),
    revision: 0,
    canUndo: false,
    canRedo: false
  }
};
