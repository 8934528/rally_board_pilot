export const GAME_EVENTS = {
  STATE_REQUEST: 'game:state:request',
  STATE_UPDATE: 'game:state:update',

  SCORE_ADD: 'game:score:add',
  SCORE_SUBTRACT: 'game:score:subtract',

  TEAM_UPDATE: 'game:team:update',

  ROUND_UPDATE: 'game:round:update',

  BOARD_PAGE_CHANGE: 'game:board:page',

  STATUS_UPDATE: 'game:status:update',

  THEME_UPDATE: 'game:theme:update',

  TIMER_SET: 'game:timer:set',
  TIMER_START: 'game:timer:start',
  TIMER_PAUSE: 'game:timer:pause',
  TIMER_RESET: 'game:timer:reset',

  WHEEL_SET: 'game:wheel:set',
  WHEEL_SPIN: 'game:wheel:spin',

  ANNOUNCEMENT_UPDATE: 'game:announcement:update',

  WINNER_UPDATE: 'game:winner:update',

  RESET_GAME: 'game:reset',

  UNDO: 'game:undo',
  REDO: 'game:redo',

  PERMISSION_UPDATE: 'game:permissions:update',
  PERMISSION_DENIED: 'game:permissions:denied',

  QUESTION_SET: 'game:question:set',
  QUESTION_SHOW: 'game:question:show',
  QUESTION_REVEAL: 'game:question:reveal',
  QUESTION_CLEAR: 'game:question:clear',
  QUESTION_MARK: 'game:question:mark',

  STATS_REQUEST: 'game:stats:request',
  STATS_UPDATE: 'game:stats:update',

  ROLE_REGISTER: 'game:role:register',
};
