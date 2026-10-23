export const GAME_CONFIG = {
  appName: 'Rally Board Pilot',
  shortName: 'RBP',

  serverUrl:
    import.meta.env.VITE_SERVER_URL ||
    'http://localhost:3001',

  defaultScoreStep: 5,

  scoreSteps: [1, 5, 10, 25, 50],

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

  maxScore: 9999,

  wheel: {
    maxEntries: 24
  }
};
