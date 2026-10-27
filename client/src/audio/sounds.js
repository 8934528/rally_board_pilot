export const SOUND_NAMES = {
  BUTTON_CLICK: 'buttonClick',
  BUTTON_CONFIRM: 'buttonConfirm',
  BUTTON_ERROR: 'buttonError',
  SCORE_UP: 'scoreUp',
  SCORE_DOWN: 'scoreDown',
  ROUND_TRANSITION: 'roundTransition',
  TIMER_WARNING: 'timerWarning',
  TIMER_END: 'timerEnd',
  WHEEL_START: 'wheelStart',
  WHEEL_TICK: 'wheelTick',
  WHEEL_STOP: 'wheelStop',
  WHEEL_RESULT: 'wheelResult',
  WINNER: 'winner',
  ANNOUNCEMENT: 'announcement'
};

export const SOUND_DEFINITIONS = {
  buttonClick: {
    name: 'buttonClick',
    description: 'Subtle UI button click feedback',
    category: 'ui',
    maxConcurrent: 2
  },
  buttonConfirm: {
    name: 'buttonConfirm',
    description: 'Positive action confirmation chime',
    category: 'ui',
    maxConcurrent: 2
  },
  buttonError: {
    name: 'buttonError',
    description: 'Error or blocked action warning tone',
    category: 'ui',
    maxConcurrent: 1
  },
  scoreUp: {
    name: 'scoreUp',
    description: 'Bright ascending score increment chime',
    category: 'game',
    maxConcurrent: 3
  },
  scoreDown: {
    name: 'scoreDown',
    description: 'Soft descending score decrement tone',
    category: 'game',
    maxConcurrent: 2
  },
  roundTransition: {
    name: 'roundTransition',
    description: 'Dynamic round transition fanfare sweep',
    category: 'game',
    maxConcurrent: 1
  },
  timerWarning: {
    name: 'timerWarning',
    description: 'Warning pulse for low timer countdown',
    category: 'timer',
    maxConcurrent: 1
  },
  timerEnd: {
    name: 'timerEnd',
    description: 'End of countdown buzzer tone',
    category: 'timer',
    maxConcurrent: 1
  },
  wheelStart: {
    name: 'wheelStart',
    description: 'Mechanical wheel spin initiation whoosh',
    category: 'wheel',
    maxConcurrent: 1
  },
  wheelTick: {
    name: 'wheelTick',
    description: 'Snappy peg click synchronized with wheel movement',
    category: 'wheel',
    maxConcurrent: 4
  },
  wheelStop: {
    name: 'wheelStop',
    description: 'Mechanical wheel latch and brake sound',
    category: 'wheel',
    maxConcurrent: 1
  },
  wheelResult: {
    name: 'wheelResult',
    description: 'Celebratory outcome reveal chime',
    category: 'wheel',
    maxConcurrent: 1
  },
  winner: {
    name: 'winner',
    description: 'Triumphant championship fanfare',
    category: 'game',
    maxConcurrent: 1
  },
  announcement: {
    name: 'announcement',
    description: 'Broadcast attention-grabbing alert chime',
    category: 'game',
    maxConcurrent: 1
  }
};
