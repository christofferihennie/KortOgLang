import { describe, expect, it } from "vitest"

import {
  buildCumulativeScores,
  formatParticipantName,
  rankByLowestScore,
} from "@/lib/game-helpers"

describe("game helpers", () => {
  it("formats participant names for compact game cards", () => {
    expect(formatParticipantName("Ola Nordmann")).toBe("Ola N")
    expect(formatParticipantName("Cher")).toBe("Cher")
    expect(formatParticipantName("   ")).toBe("Ukjent")
  })

  it("uses competition ranking when players are tied", () => {
    const scores = [2, 2, 6, 10]

    expect(rankByLowestScore(2, scores)).toBe(1)
    expect(rankByLowestScore(6, scores)).toBe(3)
    expect(rankByLowestScore(10, scores)).toBe(4)
  })

  it("builds cumulative scores in round order", () => {
    expect(
      buildCumulativeScores(
        [
          {
            roundNumber: 2,
            scores: [
              { userId: "ada", score: 3 },
              { userId: "linus", score: 1 },
            ],
          },
          {
            roundNumber: 1,
            scores: [
              { userId: "ada", score: 2 },
              { userId: "linus", score: 4 },
            ],
          },
        ],
        ["ada", "linus"]
      )
    ).toEqual([
      { round: 1, ada: 2, linus: 4 },
      { round: 2, ada: 5, linus: 5 },
    ])
  })
})
