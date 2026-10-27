import { GAME_EVENTS } from './events.js';

import {
  getGameState,
  updateGameState,
  setLastAction,
  triggerRoundTransition,
  startTimer,
  pauseTimer,
  resetTimer,
  resetGameState,
  pushHistory,
  undoState,
  redoState,
  setHostPermissions,
  getDefaultHostPermissions,
  recordStatEvent
} from './gameState.js';



const socketRoles = new Map();

function getRoleForSocket(socketId) {
  return socketRoles.get(socketId) || 'board'; // safe default
}


const CONTROLLER = 'controller';
const HOST = 'host';
const BOARD = 'board';

function hasPermission(socketId, action) {
  const role = getRoleForSocket(socketId);

  if (role === CONTROLLER) return true;  // Controller has all permissions
  if (role === BOARD) return false;       // Board never mutates

  if (role === HOST) {
    const perms = getGameState().hostPermissions;
    return perms[action] === true;
  }

  return false;
}

function denyPermission(socket, action) {
  const role = getRoleForSocket(socket.id);
  console.warn(`[PERM] Denied: socket=${socket.id} role=${role} action=${action}`);
  socket.emit(GAME_EVENTS.PERMISSION_DENIED, {
    action,
    role,
    message: `Permission denied: ${action} is not allowed for role "${role}"`
  });
}


const VALID_TEAMS = ['A', 'B'];

const VALID_PAGES = [
  'scoreboard',
  'round',
  'timer',
  'wheel',
  'announcement',
  'winner',
  'question'
];

const VALID_STATUSES = ['READY', 'LIVE', 'PAUSED', 'FINISHED'];

const MAX_TIMER_SECONDS = 180;

function broadcast(io) {
  io.emit(GAME_EVENTS.STATE_UPDATE, getGameState());
}


export function registerSocketHandlers(io, socket) {
  // Handshake authentication / role identification
  const handshakeRole = socket.handshake.auth?.role || socket.handshake.query?.role;
  const handshakeSecret = socket.handshake.auth?.secret || socket.handshake.query?.secret;

  const validRoles = [CONTROLLER, HOST, BOARD];
  let initialRole = validRoles.includes(handshakeRole) ? handshakeRole : BOARD;
  if (initialRole === CONTROLLER) {
    const expected = process.env.CONTROLLER_SECRET;
    if (expected && handshakeSecret !== expected) {
      console.warn(`[AUTH] Controller secret mismatch on handshake for socket ${socket.id}`);
      initialRole = BOARD;
    }
  }
  socketRoles.set(socket.id, initialRole);
  console.log(`[AUTH] Socket connected: ${socket.id} identified as "${initialRole}"`);

  if (initialRole === HOST) {
    socket.emit(GAME_EVENTS.PERMISSION_UPDATE, getGameState().hostPermissions);
  }

  socket.on(GAME_EVENTS.ROLE_REGISTER, ({ role, secret } = {}) => {
    try {
      const cleanRole = validRoles.includes(role) ? role : BOARD;

      // Controller secret validation
      if (cleanRole === CONTROLLER) {
        const expected = process.env.CONTROLLER_SECRET;
        if (expected && secret !== expected) {
          console.warn(`[AUTH] Controller secret mismatch for socket ${socket.id}`);
          socket.emit(GAME_EVENTS.PERMISSION_DENIED, {
            action: 'role_register',
            role: cleanRole,
            message: 'Invalid controller secret'
          });
          socketRoles.set(socket.id, BOARD);
          return;
        }
      }

      socketRoles.set(socket.id, cleanRole);
      console.log(`[ROLE] socket=${socket.id} registered as ${cleanRole}`);

      // Acknowledge
      socket.emit('game:role:ack', { role: cleanRole });

      // host, send current permissions
      if (cleanRole === HOST) {
        socket.emit(GAME_EVENTS.PERMISSION_UPDATE, getGameState().hostPermissions);
      }
    } catch (err) {
      console.error('[SOCKET ERROR] role register failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.STATE_REQUEST, () => {
    try {
      socket.emit(GAME_EVENTS.STATE_UPDATE, getGameState());
    } catch (err) {
      console.error('[SOCKET ERROR] state request failed:', err);
    }
  });

  


  socket.on(GAME_EVENTS.SCORE_ADD, ({ team, points }) => {
    try {
      if (!hasPermission(socket.id, 'score')) return denyPermission(socket, 'score');
      if (!VALID_TEAMS.includes(team)) return;

      const amount = Math.floor(Number(points));
      if (!Number.isFinite(amount) || amount <= 0) return;

      pushHistory();
      updateGameState((game) => {
        game.teams[team].score = Math.min(99999, game.teams[team].score + amount);
      });

      recordStatEvent('score_add', { team, amount });
      setLastAction(`Team ${team} +${amount} pts (${getGameState().teams[team].score})`, 'score');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] score add failed:', err);
    }
  });

  socket.on(GAME_EVENTS.SCORE_SUBTRACT, ({ team, points }) => {
    try {
      if (!hasPermission(socket.id, 'score')) return denyPermission(socket, 'score');
      if (!VALID_TEAMS.includes(team)) return;

      const amount = Math.floor(Number(points));
      if (!Number.isFinite(amount) || amount <= 0) return;

      pushHistory();
      updateGameState((game) => {
        game.teams[team].score = Math.max(0, game.teams[team].score - amount);
      });

      recordStatEvent('score_subtract', { team, amount });
      setLastAction(`Team ${team} -${amount} pts (${getGameState().teams[team].score})`, 'score');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] score subtract failed:', err);
    }
  });

  socket.on(GAME_EVENTS.TEAM_UPDATE, ({ team, name, color }) => {
    try {
      if (!hasPermission(socket.id, 'team')) return denyPermission(socket, 'team');
      if (!VALID_TEAMS.includes(team)) return;

      const cleanName = typeof name === 'string' ? name.trim().slice(0, 32) : '';
      const cleanColor = typeof color === 'string' ? color.trim().slice(0, 16) : '';

      if (!cleanName) return;

      pushHistory();
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
      if (!hasPermission(socket.id, 'round')) return denyPermission(socket, 'round');

      const roundNumber = Math.floor(Number(number));
      const roundName = typeof name === 'string' ? name.trim().slice(0, 48) : '';

      if (!Number.isInteger(roundNumber) || roundNumber < 1 || !roundName) {
        return;
      }

      const prevRound = getGameState().round.number;

      pushHistory();
      updateGameState((game) => {
        game.round.number = roundNumber;
        game.round.name = roundName;
      });

      if (roundNumber !== prevRound) {
        triggerRoundTransition(roundNumber, roundName, () => {
          broadcast(io);
        });
        recordStatEvent('round_advanced', { number: roundNumber });
      }

      setLastAction(`Round changed to ${roundNumber}: ${roundName}`, 'round');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] round update failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.BOARD_PAGE_CHANGE, ({ page }) => {
    try {
      if (!hasPermission(socket.id, 'status')) return denyPermission(socket, 'status');
      if (!VALID_PAGES.includes(page)) return;

      pushHistory();
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
      if (!hasPermission(socket.id, 'status')) return denyPermission(socket, 'status');
      if (!VALID_STATUSES.includes(status)) return;

      pushHistory();
      updateGameState((game) => {
        game.status = status;
      });

      if (status === 'LIVE') {
        recordStatEvent('game_started');
      }

      setLastAction(`Game status set to ${status}`, 'system');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] status update failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.THEME_UPDATE, ({ theme }) => {
    try {
      if (!hasPermission(socket.id, 'theme')) return denyPermission(socket, 'theme');
      if (!theme || typeof theme !== 'object') return;

      pushHistory();
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
      if (!hasPermission(socket.id, 'timer')) return denyPermission(socket, 'timer');

      const value = Math.floor(Number(seconds));

      if (!Number.isFinite(value) || value < 0 || value > MAX_TIMER_SECONDS) {
        socket.emit('error:validation', {
          field: 'timer',
          message: `Timer duration must be between 0 and ${MAX_TIMER_SECONDS} seconds (max 3 minutes).`
        });
        return;
      }

      pauseTimer();
      pushHistory();

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
      if (!hasPermission(socket.id, 'timer')) return denyPermission(socket, 'timer');

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
      if (!hasPermission(socket.id, 'timer')) return denyPermission(socket, 'timer');

      pauseTimer();
      setLastAction('Timer paused', 'timer');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] timer pause failed:', err);
    }
  });

  socket.on(GAME_EVENTS.TIMER_RESET, () => {
    try {
      if (!hasPermission(socket.id, 'timer')) return denyPermission(socket, 'timer');

      resetTimer();
      setLastAction('Timer reset to default', 'timer');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] timer reset failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.WHEEL_SET, ({ entries }) => {
    try {
      if (!hasPermission(socket.id, 'wheelConfig')) return denyPermission(socket, 'wheelConfig');
      if (!Array.isArray(entries)) return;

      const cleanEntries = entries
        .map((entry) => String(entry).trim())
        .filter(Boolean)
        .slice(0, 24);

      if (cleanEntries.length < 2) return;

      pushHistory();
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
      if (!hasPermission(socket.id, 'wheel')) return denyPermission(socket, 'wheel');

      const entries = getGameState().wheel.entries;
      if (!entries.length || getGameState().wheel.spinning) return;

      const index = Math.floor(Math.random() * entries.length);

      
      updateGameState((game) => {
        game.wheel.spinning = true;
        game.wheel.result = null;
        game.wheel.winnerIndex = index;
      });

      recordStatEvent('wheel_spin');
      setLastAction('Wheel spin initiated', 'wheel');
      broadcast(io);

      setTimeout(() => {
        const result = entries[index];
        updateGameState((game) => {
          game.wheel.spinning = false;
          game.wheel.result = result;
        });

        recordStatEvent('wheel_result', { result });
        setLastAction(`Wheel result: ${result}`, 'wheel');
        broadcast(io);
      }, 3400);
    } catch (err) {
      console.error('[SOCKET ERROR] wheel spin failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.ANNOUNCEMENT_UPDATE, ({ title, text, visible }) => {
    try {
      if (!hasPermission(socket.id, 'announcement')) return denyPermission(socket, 'announcement');

      pushHistory();
      updateGameState((game) => {
        game.announcement = {
          title: typeof title === 'string' ? title.slice(0, 100) : '',
          text: typeof text === 'string' ? text.slice(0, 280) : '',
          visible: Boolean(visible)
        };
      });

      if (visible) recordStatEvent('announcement');
      setLastAction(visible ? 'Announcement displayed' : 'Announcement hidden', 'board');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] announcement update failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.WINNER_UPDATE, ({ team, message }) => {
    try {
      if (!hasPermission(socket.id, 'winner')) return denyPermission(socket, 'winner');
      if (team !== null && !VALID_TEAMS.includes(team)) return;

      pushHistory();
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
      if (!hasPermission(socket.id, 'reset')) return denyPermission(socket, 'reset');

      resetGameState();
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] reset game failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.UNDO, () => {
    try {
      // Only controller can undo
      if (getRoleForSocket(socket.id) !== CONTROLLER) return denyPermission(socket, 'undo');

      const ok = undoState();
      if (ok) {
        setLastAction('Undo', 'system');
        broadcast(io);
      }
    } catch (err) {
      console.error('[SOCKET ERROR] undo failed:', err);
    }
  });

  socket.on(GAME_EVENTS.REDO, () => {
    try {
      if (getRoleForSocket(socket.id) !== CONTROLLER) return denyPermission(socket, 'redo');

      const ok = redoState();
      if (ok) {
        setLastAction('Redo', 'system');
        broadcast(io);
      }
    } catch (err) {
      console.error('[SOCKET ERROR] redo failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.PERMISSION_UPDATE, (permissions) => {
    try {
      if (getRoleForSocket(socket.id) !== CONTROLLER) return denyPermission(socket, 'permissions');
      if (!permissions || typeof permissions !== 'object') return;

      setHostPermissions(permissions);
      updateGameState((game) => {
        game.hostPermissions = getGameState().hostPermissions;
      });

      setLastAction('Host permissions updated', 'system');
      broadcast(io);
      io.emit(GAME_EVENTS.PERMISSION_UPDATE, getGameState().hostPermissions);
    } catch (err) {
      console.error('[SOCKET ERROR] permission update failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.QUESTION_SET, ({ question }) => {
    try {
      if (!hasPermission(socket.id, 'questions')) return denyPermission(socket, 'questions');
      if (!question || typeof question !== 'object') return;

      const clean = {
        id: String(question.id || Date.now()),
        category: String(question.category || '').slice(0, 64),
        difficulty: String(question.difficulty || 'medium'),
        text: String(question.text || '').slice(0, 500),
        options: Array.isArray(question.options)
          ? question.options.map((o) => String(o).slice(0, 200)).slice(0, 6)
          : [],
        correctAnswer: question.correctAnswer !== undefined ? question.correctAnswer : null,
        points: Number.isFinite(Number(question.points)) ? Math.floor(Number(question.points)) : 0,
        explanation: typeof question.explanation === 'string' ? question.explanation.slice(0, 500) : '',
        metadata: question.metadata || {}
      };

      pushHistory();
      updateGameState((game) => {
        game.question.current = clean;
        game.question.status = 'idle';
        game.question.lastResult = null;
      });

      setLastAction(`Question loaded: "${clean.text.slice(0, 40)}..."`, 'question');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] question set failed:', err);
    }
  });

  socket.on(GAME_EVENTS.QUESTION_SHOW, () => {
    try {
      if (!hasPermission(socket.id, 'questions')) return denyPermission(socket, 'questions');
      const q = getGameState().question.current;
      if (!q) return;

      pushHistory();
      updateGameState((game) => {
        game.question.status = 'shown';
      });

      recordStatEvent('question_asked');
      setLastAction('Question shown to board', 'question');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] question show failed:', err);
    }
  });

  socket.on(GAME_EVENTS.QUESTION_REVEAL, () => {
    try {
      if (!hasPermission(socket.id, 'questions')) return denyPermission(socket, 'questions');
      const q = getGameState().question.current;
      if (!q) return;

      pushHistory();
      updateGameState((game) => {
        game.question.status = 'revealed';
      });

      setLastAction('Answer revealed', 'question');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] question reveal failed:', err);
    }
  });

  socket.on(GAME_EVENTS.QUESTION_MARK, ({ team, correct, awardPoints }) => {
    try {
      if (!hasPermission(socket.id, 'questions')) return denyPermission(socket, 'questions');
      const q = getGameState().question.current;
      if (!q) return;

      const points = awardPoints && correct ? q.points : 0;

      pushHistory();
      updateGameState((game) => {
        game.question.status = 'marked';
        game.question.lastResult = { team, correct, points };
        game.question.history = [
          { questionId: q.id, text: q.text, team, correct, points, timestamp: new Date().toISOString() },
          ...game.question.history
        ].slice(0, 50);

        // Award points 
        if (team && correct && points > 0 && VALID_TEAMS.includes(team)) {
          game.teams[team].score = Math.min(99999, game.teams[team].score + points);
        }
      });

      if (correct) {
        recordStatEvent('question_correct', { team, points });
        if (points > 0) recordStatEvent('score_add', { team, amount: points });
      } else {
        recordStatEvent('question_incorrect', { team });
      }

      setLastAction(
        correct ? `Question correct – Team ${team} +${points} pts` : `Question incorrect – Team ${team}`,
        'question'
      );
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] question mark failed:', err);
    }
  });

  socket.on(GAME_EVENTS.QUESTION_CLEAR, () => {
    try {
      if (!hasPermission(socket.id, 'questions')) return denyPermission(socket, 'questions');

      pushHistory();
      updateGameState((game) => {
        game.question.current = null;
        game.question.status = 'idle';
        game.question.lastResult = null;
      });

      setLastAction('Question cleared', 'question');
      broadcast(io);
    } catch (err) {
      console.error('[SOCKET ERROR] question clear failed:', err);
    }
  });

  
  socket.on(GAME_EVENTS.STATS_REQUEST, () => {
    try {
      socket.emit(GAME_EVENTS.STATS_UPDATE, getGameState().stats);
    } catch (err) {
      console.error('[SOCKET ERROR] stats request failed:', err);
    }
  });

  socket.on('disconnect', () => {
    socketRoles.delete(socket.id);
  });
}
