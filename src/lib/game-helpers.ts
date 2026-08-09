export function formatParticipantName(name: string) {
  const [firstName, ...rest] = name.trim().split(/\s+/)
  const lastInitial = rest.at(-1)?.[0]

  if (!firstName) return "Ukjent"
  return lastInitial ? `${firstName} ${lastInitial}` : firstName
}

export function rankByLowestScore(score: number, allScores: number[]) {
  return allScores.filter((candidate) => candidate < score).length + 1
}

type ScoreRound = {
  roundNumber: number
  scores: Array<{ userId: string; score: number }>
}

export function buildCumulativeScores(
  rounds: ScoreRound[],
  playerIds: Iterable<string>
) {
  const players = Array.from(playerIds)
  const totals = new Map(players.map((playerId) => [playerId, 0]))

  return [...rounds]
    .sort((left, right) => left.roundNumber - right.roundNumber)
    .map((round) => {
      for (const score of round.scores) {
        totals.set(score.userId, (totals.get(score.userId) ?? 0) + score.score)
      }

      const point: Record<string, number> = { round: round.roundNumber }
      for (const playerId of players) {
        point[playerId] = totals.get(playerId) ?? 0
      }
      return point
    })
}
