export function cloneGameState(state) {
  return JSON.parse(JSON.stringify(state));
}

export function getWinningTeam(state) {
  const scoreA = state.teams.A.score;
  const scoreB = state.teams.B.score;

  if (scoreA === scoreB) {
    return null;
  }

  return scoreA > scoreB ? 'A' : 'B';
}

export function getLeaderLabel(state) {
  const winner = getWinningTeam(state);

  if (!winner) {
    return 'TIED';
  }

  return state.teams[winner].name;
}

export function getOpponent(team) {
  return team === 'A' ? 'B' : 'A';
}

export function clampScore(value, min = 0, max = 9999) {
  return Math.min(
    max,
    Math.max(min, Number(value) || 0)
  );
}
