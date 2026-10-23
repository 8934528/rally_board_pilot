export const GAME_CONFIG = {
  appName: 'Rally Board Pilot',
  shortName: 'RBP',

  serverUrl:
    import.meta.env.VITE_SERVER_URL ||
    'http://localhost:3001',

  defaultScoreStep: 5,

  scoreSteps: [1, 2, 5, 10],

  maxTimerSeconds: 180, // strictly 3 minutes max

  timerPresets: [
    10,
    15,
    30,
    45,
    60,
    90,
    120,
    180
  ],

  maxScore: 99999,

  wheel: {
    maxEntries: 24
  }
};
