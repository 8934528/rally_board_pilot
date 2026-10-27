export const BOARD_PAGES = {
  SCOREBOARD: 'scoreboard',
  ROUND: 'round',
  TIMER: 'timer',
  WHEEL: 'wheel',
  QUESTION: 'question',
  ANNOUNCEMENT: 'announcement',
  WINNER: 'winner'
};

export const BOARD_PAGE_LIST = [
  {
    id: BOARD_PAGES.SCOREBOARD,
    label: 'Scoreboard',
    icon: 'bi-bar-chart-line'
  },
  {
    id: BOARD_PAGES.ROUND,
    label: 'Round Intro',
    icon: 'bi-play-circle'
  },
  {
    id: BOARD_PAGES.TIMER,
    label: 'Timer',
    icon: 'bi-stopwatch'
  },
  {
    id: BOARD_PAGES.WHEEL,
    label: 'Spin Wheel',
    icon: 'bi-arrow-repeat'
  },
  {
    id: BOARD_PAGES.QUESTION,
    label: 'Question',
    icon: 'bi-patch-question'
  },
  {
    id: BOARD_PAGES.ANNOUNCEMENT,
    label: 'Announcement',
    icon: 'bi-megaphone'
  },
  {
    id: BOARD_PAGES.WINNER,
    label: 'Winner',
    icon: 'bi-trophy'
  }
];
