export function deriveGameStats(gameState) {
  if (!gameState) {
    return null;
  }

  const rawStats = gameState.stats || {};
  const gameRaw = rawStats.game || {};
  const teamsRaw = rawStats.teams || { A: {}, B: {} };
  const wheelRaw = rawStats.wheel || {};
  const questionsRaw = rawStats.questions || {};

  // GAME STATS
  let durationFormatted = '0m 00s';
  if (gameRaw.startedAt) {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(gameRaw.startedAt).getTime()) / 1000));
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    durationFormatted = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  const roundsPlayed = Math.max(gameState.round?.number || 1, gameRaw.rounds || 0);

  // TEAM STATS
  const teamA = gameState.teams?.A || { name: 'Team A', score: 0 };
  const teamB = gameState.teams?.B || { name: 'Team B', score: 0 };

  const teamAStatsRaw = teamsRaw.A || {};
  const teamBStatsRaw = teamsRaw.B || {};

  const teamAQTotal = (teamAStatsRaw.questionsCorrect || 0) + (teamAStatsRaw.questionsIncorrect || 0);
  const teamAAccuracy = teamAQTotal > 0 ? ((teamAStatsRaw.questionsCorrect || 0) / teamAQTotal * 100).toFixed(1) : '0.0';

  const teamBQTotal = (teamBStatsRaw.questionsCorrect || 0) + (teamBStatsRaw.questionsIncorrect || 0);
  const teamBAccuracy = teamBQTotal > 0 ? ((teamBStatsRaw.questionsCorrect || 0) / teamBQTotal * 100).toFixed(1) : '0.0';

  const teamARoundsWon = teamA.score > teamB.score ? 1 : 0;
  const teamBRoundsWon = teamB.score > teamA.score ? 1 : 0;

  // WHEEL STATS
  const wheelResults = wheelRaw.results || {};
  let mostCommonWheelResult = 'None yet';
  let highestCount = 0;
  for (const [res, count] of Object.entries(wheelResults)) {
    if (count > highestCount) {
      highestCount = count;
      mostCommonWheelResult = `${res} (${count}x)`;
    }
  }

  // QUESTIONS STATS
  const qAsked = questionsRaw.asked || 0;
  const qCorrect = questionsRaw.correct || 0;
  const qIncorrect = questionsRaw.incorrect || 0;
  const qAccuracy = (qCorrect + qIncorrect) > 0 ? (qCorrect / (qCorrect + qIncorrect) * 100).toFixed(1) : '0.0';
  const qPoints = questionsRaw.pointsEarned || 0;
  const qAvgPts = qCorrect > 0 ? (qPoints / qCorrect).toFixed(1) : '0.0';

  return {
    game: {
      status: gameState.status || 'READY',
      duration: durationFormatted,
      startedAt: gameRaw.startedAt,
      roundsPlayed,
      questionsAsked: qAsked,
      wheelSpins: wheelRaw.totalSpins || 0,
      announcements: gameRaw.announcements || 0
    },
    teams: {
      A: {
        name: teamA.name,
        currentScore: teamA.score,
        color: teamA.color,
        pointsGained: teamAStatsRaw.pointsGained || 0,
        pointsLost: teamAStatsRaw.pointsLost || 0,
        roundsWon: teamARoundsWon,
        questionsAnswered: teamAQTotal,
        correctAnswers: teamAStatsRaw.questionsCorrect || 0,
        incorrectAnswers: teamAStatsRaw.questionsIncorrect || 0,
        accuracy: `${teamAAccuracy}%`
      },
      B: {
        name: teamB.name,
        currentScore: teamB.score,
        color: teamB.color,
        pointsGained: teamBStatsRaw.pointsGained || 0,
        pointsLost: teamBStatsRaw.pointsLost || 0,
        roundsWon: teamBRoundsWon,
        questionsAnswered: teamBQTotal,
        correctAnswers: teamBStatsRaw.questionsCorrect || 0,
        incorrectAnswers: teamBStatsRaw.questionsIncorrect || 0,
        accuracy: `${teamBAccuracy}%`
      }
    },
    wheel: {
      totalSpins: wheelRaw.totalSpins || 0,
      mostCommonResult: mostCommonWheelResult,
      resultFrequency: wheelResults
    },
    questions: {
      asked: qAsked,
      correct: qCorrect,
      incorrect: qIncorrect,
      accuracy: `${qAccuracy}%`,
      pointsEarned: qPoints,
      avgPointsPerQuestion: qAvgPts
    }
  };
}
