import { GAME_EVENTS } from '../constants/gameEvents';

export function useController(socket) {
  const addScore = (team, points) => {
    socket.emit(
      GAME_EVENTS.SCORE_ADD,
      {
        team,
        points
      }
    );
  };

  const subtractScore = (team, points) => {
    socket.emit(
      GAME_EVENTS.SCORE_SUBTRACT,
      {
        team,
        points
      }
    );
  };

  const updateTeam = (
    team,
    name,
    color
  ) => {
    socket.emit(
      GAME_EVENTS.TEAM_UPDATE,
      {
        team,
        name,
        color
      }
    );
  };

  const updateRound = (
    number,
    name
  ) => {
    socket.emit(
      GAME_EVENTS.ROUND_UPDATE,
      {
        number,
        name
      }
    );
  };

  const changePage = (page) => {
    socket.emit(
      GAME_EVENTS.BOARD_PAGE_CHANGE,
      {
        page
      }
    );
  };

  const updateStatus = (status) => {
    socket.emit(
      GAME_EVENTS.STATUS_UPDATE,
      {
        status
      }
    );
  };

  const updateTheme = (theme) => {
    socket.emit(
      GAME_EVENTS.THEME_UPDATE,
      {
        theme
      }
    );
  };

  const setTimer = (seconds) => {
    socket.emit(
      GAME_EVENTS.TIMER_SET,
      {
        seconds
      }
    );
  };

  const startTimer = () => {
    socket.emit(
      GAME_EVENTS.TIMER_START
    );
  };

  const pauseTimer = () => {
    socket.emit(
      GAME_EVENTS.TIMER_PAUSE
    );
  };

  const resetTimer = () => {
    socket.emit(
      GAME_EVENTS.TIMER_RESET
    );
  };

  const setWheel = (entries) => {
    socket.emit(
      GAME_EVENTS.WHEEL_SET,
      {
        entries
      }
    );
  };

  const spinWheel = () => {
    socket.emit(
      GAME_EVENTS.WHEEL_SPIN
    );
  };

  const updateAnnouncement = (
    title,
    text,
    visible
  ) => {
    socket.emit(
      GAME_EVENTS.ANNOUNCEMENT_UPDATE,
      {
        title,
        text,
        visible
      }
    );
  };

  const updateWinner = (
    team,
    message
  ) => {
    socket.emit(
      GAME_EVENTS.WINNER_UPDATE,
      {
        team,
        message
      }
    );
  };

  const resetGame = () => {
    socket.emit(
      GAME_EVENTS.RESET_GAME
    );
  };

  return {
    addScore,
    subtractScore,
    updateTeam,
    updateRound,
    changePage,
    updateStatus,
    updateTheme,
    setTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    setWheel,
    spinWheel,
    updateAnnouncement,
    updateWinner,
    resetGame
  };
}
