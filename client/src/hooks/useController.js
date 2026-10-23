import { GAME_EVENTS } from '../constants/gameEvents';
import { GAME_CONFIG } from '../config/gameConfig';

export function useController(socket) {
  const addScore = (team, points) => {
    if (!socket?.connected) return;
    const pts = Math.floor(Number(points));
    if (!Number.isFinite(pts) || pts <= 0) return;
    socket.emit(GAME_EVENTS.SCORE_ADD, { team, points: pts });
  };

  const subtractScore = (team, points) => {
    if (!socket?.connected) return;
    const pts = Math.floor(Number(points));
    if (!Number.isFinite(pts) || pts <= 0) return;
    socket.emit(GAME_EVENTS.SCORE_SUBTRACT, { team, points: pts });
  };

  const updateTeam = (team, name, color) => {
    if (!socket?.connected) return;
    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanName) return;
    socket.emit(GAME_EVENTS.TEAM_UPDATE, {
      team,
      name: cleanName,
      color: typeof color === 'string' ? color.trim() : undefined
    });
  };

  const updateRound = (number, name) => {
    if (!socket?.connected) return;
    const roundNumber = Math.max(1, Math.floor(Number(number) || 1));
    const roundName = typeof name === 'string' && name.trim() ? name.trim() : `Round ${roundNumber}`;
    socket.emit(GAME_EVENTS.ROUND_UPDATE, { number: roundNumber, name: roundName });
  };

  const changePage = (page) => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.BOARD_PAGE_CHANGE, { page });
  };

  const updateStatus = (status) => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.STATUS_UPDATE, { status });
  };

  const updateTheme = (theme) => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.THEME_UPDATE, { theme });
  };

  const setTimer = (seconds) => {
    if (!socket?.connected) return;
    const val = Math.floor(Number(seconds));
    // Strictly validate: 0 to 180 seconds (3 min max)
    if (!Number.isFinite(val) || val < 0) return;
    const clamped = Math.min(GAME_CONFIG.maxTimerSeconds, val);
    socket.emit(GAME_EVENTS.TIMER_SET, { seconds: clamped });
  };

  const startTimer = () => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.TIMER_START);
  };

  const pauseTimer = () => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.TIMER_PAUSE);
  };

  const resetTimer = () => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.TIMER_RESET);
  };

  const setWheel = (entries) => {
    if (!socket?.connected) return;
    if (!Array.isArray(entries)) return;
    socket.emit(GAME_EVENTS.WHEEL_SET, { entries });
  };

  const spinWheel = () => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.WHEEL_SPIN);
  };

  const updateAnnouncement = (title, text, visible) => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.ANNOUNCEMENT_UPDATE, { title, text, visible });
  };

  const updateWinner = (team, message) => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.WINNER_UPDATE, { team, message });
  };

  const resetGame = () => {
    if (!socket?.connected) return;
    socket.emit(GAME_EVENTS.RESET_GAME);
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
