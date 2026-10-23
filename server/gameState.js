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

  activities: [
    {
      id: 'init-1',
      message: 'System initialized in READY state',
      category: 'system',
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString()
    }
  ],

  meta: {
    lastAction: 'System ready',
    lastActionAt: new Date().toISOString(),
    revision: 0
  }
};

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

export function startTimer(onTick) {
  if (gameState.timer.running) {
    return;
  }

  gameState.timer.running = true;

  timerInterval = setInterval(() => {
    if (gameState.timer.seconds <= 0) {
      stopTimer();
      gameState.timer.running = false;
      onTick();
      return;
    }

    gameState.timer.seconds -= 1;
    onTick();
  }, 1000);
}

export function pauseTimer() {
  gameState.timer.running = false;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  gameState.timer.running = false;
}

export function resetTimer() {
  stopTimer();
  gameState.timer.seconds = gameState.timer.total;
}

export function resetGameState() {
  stopTimer();

  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
    transitionTimeout = null;
  }

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

  gameState.meta.revision += 1;
  gameState.meta.lastAction = 'Game reset';
  gameState.meta.lastActionAt = new Date().toISOString();

  setLastAction('Game reset to initial state', 'system');

  return gameState;
}
