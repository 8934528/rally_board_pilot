import { GAME_EVENTS } from './events.js';

import {
  getGameState,
  updateGameState,
  setLastAction,
  triggerRoundTransition,
  startTimer,
  pauseTimer,
  resetTimer,
  resetGameState
} from './gameState.js';

const VALID_TEAMS = ['A', 'B'];

const VALID_PAGES = [
  'scoreboard',
  'round',
  'timer',
  'wheel',
  'announcement',
  'winner'
];

const VALID_STATUSES = ['READY', 'LIVE', 'PAUSED', 'FINISHED'];

const MAX_TIMER_SECONDS = 180; // 3 minutes strictly enforced

function broadcast(io) {
  io.emit(GAME_EVENTS.STATE_UPDATE, getGameState());
}

export function registerSocketHandlers(io, socket) {
  socket.on(GAME_EVENTS.STATE_REQUEST, () => {
    try {
      socket.emit(GAME_EVENTS.STATE_UPDATE, getGameState());
    } catch (err) {
      console.error('[SOCKET ERROR] state request failed:', err);
    }
  });

  socket.on(GAME_EVENTS.SCORE_ADD, ({ team, points }) => {
    try {
      if (!VALID_TEAMS.includes(team)) return;

      const amount = Math.floor(Number(points));
      if (!Number.isFinite(amount) || amount <= 0) return;

      updateGameState((game) => {
        game.teams[team].score = Math.min(99999, game.teams[team].score + amount);
      });

      setLastAction(`Team ${team} +${amount} pts (${getGameState().teams[team].score})`, 'score');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] score add failed:', err);
    }
  });

  socket.on(GAME_EVENTS.SCORE_SUBTRACT, ({ team, points }) => {
    try {
      if (!VALID_TEAMS.includes(team)) return;

      const amount = Math.floor(Number(points));
      if (!Number.isFinite(amount) || amount <= 0) return;

      updateGameState((game) => {
        game.teams[team].score = Math.max(0, game.teams[team].score - amount);
      });

      setLastAction(`Team ${team} -${amount} pts (${getGameState().teams[team].score})`, 'score');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] score subtract failed:', err);
    }
  });

  socket.on(GAME_EVENTS.TEAM_UPDATE, ({ team, name, color }) => {
    try {
      if (!VALID_TEAMS.includes(team)) return;

      const cleanName = typeof name === 'string' ? name.trim().slice(0, 32) : '';
      const cleanColor = typeof color === 'string' ? color.trim().slice(0, 16) : '';

      if (!cleanName) return;

      updateGameState((game) => {
        game.teams[team].name = cleanName;
        if (cleanColor) {
          game.teams[team].color = cleanColor;
        }
      });

      setLastAction(`Team ${team} renamed to "${cleanName}"`, 'team');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] team update failed:', err);
    }
  });

  socket.on(GAME_EVENTS.ROUND_UPDATE, ({ number, name }) => {
    try {
      const roundNumber = Math.floor(Number(number));
      const roundName = typeof name === 'string' ? name.trim().slice(0, 48) : '';

      if (!Number.isInteger(roundNumber) || roundNumber < 1 || !roundName) {
        return;
      }

      const prevRound = getGameState().round.number;

      updateGameState((game) => {
        game.round.number = roundNumber;
        game.round.name = roundName;
      });

      // Trigger board round transition
      if (roundNumber !== prevRound) {
        triggerRoundTransition(roundNumber, roundName, () => {
          broadcast(io);
        });
      }

      setLastAction(`Round changed to ${roundNumber}: ${roundName}`, 'round');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] round update failed:', err);
    }
  });

  socket.on(GAME_EVENTS.BOARD_PAGE_CHANGE, ({ page }) => {
    try {
      if (!VALID_PAGES.includes(page)) return;

      updateGameState((game) => {
        game.board.activePage = page;
      });

      setLastAction(`Board view switched to ${page.toUpperCase()}`, 'board');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] board page change failed:', err);
    }
  });

  socket.on(GAME_EVENTS.STATUS_UPDATE, ({ status }) => {
    try {
      if (!VALID_STATUSES.includes(status)) return;

      updateGameState((game) => {
        game.status = status;
      });

      setLastAction(`Game status set to ${status}`, 'system');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] status update failed:', err);
    }
  });

  socket.on(GAME_EVENTS.THEME_UPDATE, ({ theme }) => {
    try {
      if (!theme || typeof theme !== 'object') return;

      updateGameState((game) => {
        game.board.theme = {
          ...game.board.theme,
          ...theme
        };
      });

      setLastAction(`Board theme updated: ${theme.name || 'custom'}`, 'system');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] theme update failed:', err);
    }
  });

  socket.on(GAME_EVENTS.TIMER_SET, ({ seconds }) => {
    try {
      const value = Math.floor(Number(seconds));

      // Strictly validate: timer 180s = 3 minutes
      if (!Number.isFinite(value) || value < 0 || value > MAX_TIMER_SECONDS) {
        socket.emit('error:validation', {
          field: 'timer',
          message: `Timer duration must be between 0 and ${MAX_TIMER_SECONDS} seconds (max 3 minutes).`
        });
        return;
      }

      pauseTimer();

      updateGameState((game) => {
        game.timer.seconds = value;
        game.timer.total = value;
        game.timer.running = false;
      });

      setLastAction(`Timer configured to ${value}s`, 'timer');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] timer set failed:', err);
    }
  });

  socket.on(GAME_EVENTS.TIMER_START, () => {
    try {
      startTimer(() => {
        broadcast(io);
      });

      setLastAction('Timer started', 'timer');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] timer start failed:', err);
    }
  });

  socket.on(GAME_EVENTS.TIMER_PAUSE, () => {
    try {
      pauseTimer();
      setLastAction('Timer paused', 'timer');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] timer pause failed:', err);
    }
  });

  socket.on(GAME_EVENTS.TIMER_RESET, () => {
    try {
      resetTimer();
      setLastAction('Timer reset to default', 'timer');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] timer reset failed:', err);
    }
  });

  socket.on(GAME_EVENTS.WHEEL_SET, ({ entries }) => {
    try {
      if (!Array.isArray(entries)) return;

      const cleanEntries = entries
        .map((entry) => String(entry).trim())
        .filter(Boolean)
        .slice(0, 24);

      if (cleanEntries.length < 2) return;

      updateGameState((game) => {
        game.wheel.entries = cleanEntries;
        game.wheel.result = null;
        game.wheel.winnerIndex = null;
      });

      setLastAction(`Wheel options updated (${cleanEntries.length} items)`, 'wheel');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] wheel set failed:', err);
    }
  });

  socket.on(GAME_EVENTS.WHEEL_SPIN, () => {
    try {
      const entries = getGameState().wheel.entries;
      if (!entries.length || getGameState().wheel.spinning) return;

      const index = Math.floor(Math.random() * entries.length);

      updateGameState((game) => {
        game.wheel.spinning = true;
        game.wheel.result = null;
        game.wheel.winnerIndex = index;
      });

      setLastAction('Wheel spin initiated', 'wheel');
      broadcast(io);

      setTimeout(() => {
        updateGameState((game) => {
          game.wheel.spinning = false;
          game.wheel.result = entries[index];
        });

        setLastAction(`Wheel result: ${entries[index]}`, 'wheel');
        broadcast(io);
      }, 3400);
    } catch (err) {
      console.error('[SOCKET ERROR] wheel spin failed:', err);
    }
  });

  socket.on(GAME_EVENTS.ANNOUNCEMENT_UPDATE, ({ title, text, visible }) => {
    try {
      updateGameState((game) => {
        game.announcement = {
          title: typeof title === 'string' ? title.slice(0, 100) : '',
          text: typeof text === 'string' ? text.slice(0, 280) : '',
          visible: Boolean(visible)
        };
      });

      setLastAction(visible ? 'Announcement displayed' : 'Announcement hidden', 'board');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] announcement update failed:', err);
    }
  });

  socket.on(GAME_EVENTS.WINNER_UPDATE, ({ team, message }) => {
    try {
      if (team !== null && !VALID_TEAMS.includes(team)) return;

      updateGameState((game) => {
        game.winner.team = team;
        game.winner.message = typeof message === 'string' ? message.slice(0, 100) : 'Congratulations!';
      });

      setLastAction(team ? `Winner declared: Team ${team}` : 'Winner cleared', 'system');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] winner update failed:', err);
    }
  });

  socket.on(GAME_EVENTS.RESET_GAME, () => {
    try {
      resetGameState();
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] reset game failed:', err);
    }
  });
}
