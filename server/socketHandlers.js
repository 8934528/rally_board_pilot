import { GAME_EVENTS } from '../client/src/constants/gameEvents.js';

import { getGameState, updateGameState } from './gameState.js';

const VALID_TEAMS = ['A', 'B'];

const VALID_BOARD_PAGES = [
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

export function registerSocketHandlers(io, socket) {
  /*
   * SEND CURRENT STATE
   */

  socket.on(
    GAME_EVENTS.STATE_REQUEST,
    () => {
      socket.emit(
        GAME_EVENTS.STATE_UPDATE,
        getGameState()
      );
    }
  );

  /*
   * SCORE
   */

  socket.on(
    GAME_EVENTS.SCORE_ADD,
    ({ team, points }) => {
      if (!VALID_TEAMS.includes(team)) {
        return;
      }

      if (
        !Number.isFinite(points) ||
        points <= 0
      ) {
        return;
      }

      const state = updateGameState(
        (game) => {
          game.teams[team].score += points;
        }
      );

      io.emit(
        GAME_EVENTS.STATE_UPDATE,
        state
      );

      console.log(
        `Team ${team} +${points} → ${state.teams[team].score}`
      );
    }
  );

  socket.on(
    GAME_EVENTS.SCORE_SUBTRACT,
    ({ team, points }) => {
      if (!VALID_TEAMS.includes(team)) {
        return;
      }

      if (
        !Number.isFinite(points) ||
        points <= 0
      ) {
        return;
      }

      const state = updateGameState(
        (game) => {
          game.teams[team].score =
            Math.max(
              0,
              game.teams[team].score - points
            );
        }
      );

      io.emit(
        GAME_EVENTS.STATE_UPDATE,
        state
      );

      console.log(
        `Team ${team} -${points} → ${state.teams[team].score}`
      );
    }
  );

  /*
   * TEAM CONFIGURATION
   */

  socket.on(
    GAME_EVENTS.TEAM_UPDATE,
    ({ team, name, color }) => {
      if (!VALID_TEAMS.includes(team)) {
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

      const state = updateGameState(
        (game) => {
          game.teams[team].name =
            cleanName;

          if (cleanColor) {
            game.teams[team].color =
              cleanColor;
          }
        }
      );

      io.emit(
        GAME_EVENTS.STATE_UPDATE,
        state
      );

      console.log(
        `Team ${team} updated: ${state.teams[team].name}`
      );
    }
  );

  /*
   * ROUND
   */

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
        !Number.isInteger(roundNumber) ||
        roundNumber < 1
      ) {
        return;
      }

      if (!roundName) {
        return;
      }

      const state = updateGameState(
        (game) => {
          game.round.number =
            roundNumber;

          game.round.name =
            roundName;
        }
      );

      io.emit(
        GAME_EVENTS.STATE_UPDATE,
        state
      );

      console.log(
        `Round updated: ${roundNumber} - ${roundName}`
      );
    }
  );

  /*
   * BOARD PAGE
   */

  socket.on(
    GAME_EVENTS.BOARD_PAGE_CHANGE,
    ({ page }) => {
      if (
        !VALID_BOARD_PAGES.includes(page)
      ) {
        return;
      }

      const state = updateGameState(
        (game) => {
          game.board.activePage = page;
        }
      );

      io.emit(
        GAME_EVENTS.STATE_UPDATE,
        state
      );

      console.log(
        `Board page: ${page}`
      );
    }
  );

  /*
   * GAME STATUS
   */

  socket.on(
    GAME_EVENTS.STATUS_UPDATE,
    ({ status }) => {
      if (
        !VALID_STATUSES.includes(status)
      ) {
        return;
      }

      const state = updateGameState(
        (game) => {
          game.status = status;
        }
      );

      io.emit(
        GAME_EVENTS.STATE_UPDATE,
        state
      );

      console.log(
        `Game status: ${status}`
      );
    }
  );
}
