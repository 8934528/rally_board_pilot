const MAX_HISTORY = 50;

const DEFAULT_HOST_PERMISSIONS = {
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

const gameState = {
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

let undoStack = [];
let redoStack = [];

function snapshotState() {
  const snap = {
    status: gameState.status,
    round: { ...gameState.round },
    teams: {
      A: { ...gameState.teams.A },
      B: { ...gameState.teams.B }
    },
    board: {
      activePage: gameState.board.activePage,
      theme: { ...gameState.board.theme }
    },
    timer: { ...gameState.timer },
    wheel: {
      entries: [...gameState.wheel.entries],
      spinning: gameState.wheel.spinning,
      result: gameState.wheel.result,
      winnerIndex: gameState.wheel.winnerIndex
    },
    announcement: { ...gameState.announcement },
    winner: { ...gameState.winner },
    hostPermissions: { ...gameState.hostPermissions },
    question: {
      current: gameState.question.current ? { ...gameState.question.current } : null,
      status: gameState.question.status,
      lastResult: gameState.question.lastResult ? { ...gameState.question.lastResult } : null,
      history: [...gameState.question.history]
    }
  };
  return JSON.stringify(snap);
}

function restoreSnapshot(serialised) {
  stopTimer();

  const snap = JSON.parse(serialised);
  gameState.status = snap.status;
  gameState.round = snap.round;
  gameState.teams.A = snap.teams.A;
  gameState.teams.B = snap.teams.B;
  gameState.board.activePage = snap.board.activePage;
  gameState.board.theme = snap.board.theme;
  gameState.timer = { ...snap.timer, running: false };
  gameState.wheel = snap.wheel;
  gameState.announcement = snap.announcement;
  gameState.winner = snap.winner;
  gameState.hostPermissions = snap.hostPermissions;
  gameState.question = snap.question;
}

export function pushHistory() {
  undoStack.push(snapshotState());
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }
  redoStack = [];
  _updateUndoRedoMeta();
}

export function undoState() {
  if (undoStack.length === 0) return false;
  redoStack.push(snapshotState());
  const prev = undoStack.pop();
  restoreSnapshot(prev);
  gameState.meta.revision += 1;
  gameState.meta.lastAction = 'Undo';
  gameState.meta.lastActionAt = new Date().toISOString();
  _updateUndoRedoMeta();
  return true;
}

export function redoState() {
  if (redoStack.length === 0) return false;
  undoStack.push(snapshotState());
  const next = redoStack.pop();
  restoreSnapshot(next);
  gameState.meta.revision += 1;
  gameState.meta.lastAction = 'Redo';
  gameState.meta.lastActionAt = new Date().toISOString();
  _updateUndoRedoMeta();
  return true;
}

function _updateUndoRedoMeta() {
  gameState.meta.canUndo = undoStack.length > 0;
  gameState.meta.canRedo = redoStack.length > 0;
}

let timerInterval = null;
let transitionTimeout = null;

export function getGameState() {
  return gameState;
}

export function updateGameState(updater) {
  updater(gameState);

  gameState.meta.revision += 1;
  gameState.meta.lastActionAt = new Date().toISOString();

  return gameState;
}

export function setLastAction(message, category = 'general') {
  gameState.meta.lastAction = message;
  gameState.meta.lastActionAt = new Date().toISOString();

  const activity = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    message,
    category,
    time: new Date().toLocaleTimeString(),
    timestamp: new Date().toISOString()
  };

  gameState.activities = [activity, ...gameState.activities].slice(0, 50);
}

export function triggerRoundTransition(roundNumber, roundName, onEnd) {
  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
  }

  gameState.roundTransition = {
    active: true,
    number: roundNumber,
    name: roundName
  };

  transitionTimeout = setTimeout(() => {
    gameState.roundTransition.active = false;
    transitionTimeout = null;
    if (typeof onEnd === 'function') {
      onEnd();
    }
  }, 2200);
}

function clearTimerInterval() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export function startTimer(onTick) {
  if (gameState.timer.running) {
    return;
  }

  clearTimerInterval();
  gameState.timer.running = true;

  timerInterval = setInterval(() => {
    if (gameState.timer.seconds <= 0) {
      stopTimer();
      onTick();
      return;
    }

    gameState.timer.seconds -= 1;
    onTick();
  }, 1000);
}

export function pauseTimer() {
  gameState.timer.running = false;
  clearTimerInterval();
}

export function stopTimer() {
  clearTimerInterval();
  gameState.timer.running = false;
}

export function resetTimer() {
  stopTimer();
  gameState.timer.seconds = gameState.timer.total;
}

export function getHostPermissions() {
  return gameState.hostPermissions;
}

export function setHostPermissions(permissions) {
  gameState.hostPermissions = {
    ...DEFAULT_HOST_PERMISSIONS,
    ...permissions
  };
}

export function getDefaultHostPermissions() {
  return { ...DEFAULT_HOST_PERMISSIONS };
}

export function recordStatEvent(type, data = {}) {
  switch (type) {
    case 'game_started':
      if (!gameState.stats.game.startedAt) {
        gameState.stats.game.startedAt = new Date().toISOString();
      }
      break;
    case 'round_advanced':
      gameState.stats.game.rounds = Math.max(gameState.stats.game.rounds, data.number || 0);
      break;
    case 'score_add':
      if (data.team && gameState.stats.teams[data.team]) {
        gameState.stats.teams[data.team].pointsGained += data.amount || 0;
      }
      break;
    case 'score_subtract':
      if (data.team && gameState.stats.teams[data.team]) {
        gameState.stats.teams[data.team].pointsLost += data.amount || 0;
      }
      break;
    case 'wheel_spin':
      gameState.stats.game.wheelSpins += 1;
      gameState.stats.wheel.totalSpins += 1;
      break;
    case 'wheel_result':
      if (data.result) {
        gameState.stats.wheel.results[data.result] =
          (gameState.stats.wheel.results[data.result] || 0) + 1;
      }
      break;
    case 'announcement':
      gameState.stats.game.announcements += 1;
      break;
    case 'question_asked':
      gameState.stats.game.questionsAsked += 1;
      gameState.stats.questions.asked += 1;
      break;
    case 'question_correct':
      gameState.stats.questions.correct += 1;
      gameState.stats.questions.pointsEarned += data.points || 0;
      if (data.team && gameState.stats.teams[data.team]) {
        gameState.stats.teams[data.team].questionsCorrect += 1;
      }
      break;
    case 'question_incorrect':
      gameState.stats.questions.incorrect += 1;
      if (data.team && gameState.stats.teams[data.team]) {
        gameState.stats.teams[data.team].questionsIncorrect += 1;
      }
      break;
    default:
      break;
  }
}

export function resetGameState() {
  stopTimer();

  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
    transitionTimeout = null;
  }

  undoStack = [];
  redoStack = [];
  _updateUndoRedoMeta();

  gameState.status = 'READY';

  gameState.round = {
    number: 1,
    name: 'Opening Round'
  };

  gameState.roundTransition = {
    active: false,
    number: 1,
    name: 'Opening Round'
  };

  gameState.teams.A.score = 0;
  gameState.teams.B.score = 0;

  gameState.board.activePage = 'scoreboard';

  gameState.timer = {
    running: false,
    seconds: 30,
    total: 30
  };

  gameState.wheel.spinning = false;
  gameState.wheel.result = null;
  gameState.wheel.winnerIndex = null;

  gameState.announcement = {
    text: '',
    title: '',
    visible: false
  };

  gameState.winner = {
    team: null,
    message: 'Congratulations!'
  };

  gameState.question = {
    current: null,
    status: 'idle',
    lastResult: null,
    history: []
  };

  gameState.stats = {
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
  };

  gameState.meta.revision += 1;
  gameState.meta.lastAction = 'Game reset';
  gameState.meta.lastActionAt = new Date().toISOString();
  gameState.meta.canUndo = false;
  gameState.meta.canRedo = false;

  setLastAction('Game reset to initial state', 'system');

  return gameState;
}
