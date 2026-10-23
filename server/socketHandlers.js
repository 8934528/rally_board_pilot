import {
  GAME_EVENTS
} from './events.js';

import {
  getGameState,
  updateGameState,
  setLastAction,
  startTimer,
  pauseTimer,
  resetTimer,
  resetGameState
} from './gameState.js';

const VALID_TEAMS = [
  'A',
  'B'
];

const VALID_PAGES = [
  'scoreboard',
  'round',
  'timer',
  'wheel',
  'announcement',
  'winner'
];

const VALID_STATUSES = [
  'READY',
  'LIVE',
  'PAUSED',
  'FINISHED'
];

function broadcast(io) {
  io.emit(
    GAME_EVENTS.STATE_UPDATE,
    getGameState()
  );
}

export function registerSocketHandlers(
  io,
  socket
) {
  socket.on(
    GAME_EVENTS.STATE_REQUEST,
    () => {
      socket.emit(
        GAME_EVENTS.STATE_UPDATE,
        getGameState()
      );
    }
  );

  socket.on(
    GAME_EVENTS.SCORE_ADD,
    ({ team, points }) => {
      if (
        !VALID_TEAMS.includes(team)
      ) {
        return;
      }

      const amount = Number(points);

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return;
      }

      updateGameState(
        (game) => {
          game.teams[team].score +=
            amount;
        }
      );

      setLastAction(
        `Team ${team} +${amount}`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.SCORE_SUBTRACT,
    ({ team, points }) => {
      if (
        !VALID_TEAMS.includes(team)
      ) {
        return;
      }

      const amount = Number(points);

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return;
      }

      updateGameState(
        (game) => {
          game.teams[team].score =
            Math.max(
              0,
              game.teams[team].score -
                amount
            );
        }
      );

      setLastAction(
        `Team ${team} -${amount}`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.TEAM_UPDATE,
    ({ team, name, color }) => {
      if (
        !VALID_TEAMS.includes(team)
      ) {
        return;
      }

      const cleanName =
        typeof name === 'string'
          ? name.trim()
          : '';

      const cleanColor =
        typeof color === 'string'
          ? color.trim()
          : '';

      if (!cleanName) {
        return;
      }

      updateGameState(
        (game) => {
          game.teams[team].name =
            cleanName;

          if (cleanColor) {
            game.teams[team].color =
              cleanColor;
          }
        }
      );

      setLastAction(
        `Team ${team} updated`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.ROUND_UPDATE,
    ({ number, name }) => {
      const roundNumber =
        Number(number);

      const roundName =
        typeof name === 'string'
          ? name.trim()
          : '';

      if (
        !Number.isInteger(
          roundNumber
        ) ||
        roundNumber < 1 ||
        !roundName
      ) {
        return;
      }

      updateGameState(
        (game) => {
          game.round.number =
            roundNumber;

          game.round.name =
            roundName;
        }
      );

      setLastAction(
        `Round ${roundNumber}: ${roundName}`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.BOARD_PAGE_CHANGE,
    ({ page }) => {
      if (
        !VALID_PAGES.includes(page)
      ) {
        return;
      }

      updateGameState(
        (game) => {
          game.board.activePage =
            page;
        }
      );

      setLastAction(
        `Board page: ${page}`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.STATUS_UPDATE,
    ({ status }) => {
      if (
        !VALID_STATUSES.includes(status)
      ) {
        return;
      }

      updateGameState(
        (game) => {
          game.status = status;
        }
      );

      setLastAction(
        `Game status: ${status}`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.THEME_UPDATE,
    ({ theme }) => {
      if (!theme) {
        return;
      }

      updateGameState(
        (game) => {
          game.board.theme = {
            ...game.board.theme,
            ...theme
          };
        }
      );

      setLastAction(
        `Theme changed`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.TIMER_SET,
    ({ seconds }) => {
      const value =
        Number(seconds);

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > 3600
      ) {
        return;
      }

      updateGameState(
        (game) => {
          game.timer.seconds =
            Math.floor(value);

          game.timer.total =
            Math.floor(value);

          game.timer.running =
            false;
        }
      );

      pauseTimer();

      setLastAction(
        `Timer set to ${value}s`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.TIMER_START,
    () => {
      startTimer(() => {
        setLastAction(
          'Timer tick'
        );

        broadcast(io);
      });

      setLastAction(
        'Timer started'
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.TIMER_PAUSE,
    () => {
      pauseTimer();

      setLastAction(
        'Timer paused'
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.TIMER_RESET,
    () => {
      resetTimer();

      setLastAction(
        'Timer reset'
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.WHEEL_SET,
    ({ entries }) => {
      if (
        !Array.isArray(entries)
      ) {
        return;
      }

      const cleanEntries =
        entries
          .map((entry) =>
            String(entry).trim()
          )
          .filter(Boolean)
          .slice(0, 24);

      updateGameState(
        (game) => {
          game.wheel.entries =
            cleanEntries;

          game.wheel.result = null;
          game.wheel.winnerIndex =
            null;
        }
      );

      setLastAction(
        'Wheel updated'
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.WHEEL_SPIN,
    () => {
      const entries =
        getGameState().wheel.entries;

      if (!entries.length) {
        return;
      }

      const index =
        Math.floor(
          Math.random() *
            entries.length
        );

      updateGameState(
        (game) => {
          game.wheel.spinning = true;
          game.wheel.result = null;
          game.wheel.winnerIndex =
            index;
        }
      );

      setLastAction(
        'Wheel spinning'
      );

      broadcast(io);

      setTimeout(() => {
        updateGameState(
          (game) => {
            game.wheel.spinning =
              false;

            game.wheel.result =
              entries[index];
          }
        );

        setLastAction(
          `Wheel result: ${entries[index]}`
        );

        broadcast(io);
      }, 3200);
    }
  );

  socket.on(
    GAME_EVENTS.ANNOUNCEMENT_UPDATE,
    ({
      title,
      text,
      visible
    }) => {
      updateGameState(
        (game) => {
          game.announcement = {
            title:
              typeof title === 'string'
                ? title
                : '',

            text:
              typeof text === 'string'
                ? text
                : '',

            visible:
              Boolean(visible)
          };
        }
      );

      setLastAction(
        'Announcement updated'
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.WINNER_UPDATE,
    ({
      team,
      message
    }) => {
      if (
        team !== null &&
        !VALID_TEAMS.includes(team)
      ) {
        return;
      }

      updateGameState(
        (game) => {
          game.winner.team =
            team;

          game.winner.message =
            typeof message === 'string'
              ? message
              : 'Congratulations!';
        }
      );

      setLastAction(
        `Winner updated`
      );

      broadcast(io);
    }
  );

  socket.on(
    GAME_EVENTS.RESET_GAME,
    () => {
      resetGameState();

      broadcast(io);
    }
  );
}
