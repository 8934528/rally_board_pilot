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

let timerInterval = null;

export function getGameState() {
  return gameState;
}

export function updateGameState(updater) {
  updater(gameState);

  gameState.meta.revision += 1;
  gameState.meta.lastActionAt =
    new Date().toISOString();

  return gameState;
}

export function setLastAction(message) {
  gameState.meta.lastAction = message;
  gameState.meta.lastActionAt =
    new Date().toISOString();
}

export function startTimer(onTick) {
  if (gameState.timer.running) {
    return;
  }

  gameState.timer.running = true;

  timerInterval = setInterval(() => {
    if (
      gameState.timer.seconds <= 0
    ) {
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

  gameState.timer.seconds =
    gameState.timer.total;
}

export function resetGameState() {
  stopTimer();

  gameState.status = 'READY';

  gameState.round = {
    number: 1,
    name: 'Opening Round'
  };

  gameState.teams.A.score = 0;
  gameState.teams.B.score = 0;

  gameState.board.activePage =
    'scoreboard';

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
  gameState.meta.lastAction =
    'Game reset';
  gameState.meta.lastActionAt =
    new Date().toISOString();

  return gameState;
}
