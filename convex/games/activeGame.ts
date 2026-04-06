import { ConvexError, v } from "convex/values"
import { api } from "../_generated/api"
import type { Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"
import { mutation, query } from "../_generated/server"
import { getCurrentUser } from "../auth"

async function getGameOrThrow(ctx: QueryCtx, id: Id<"games">) {
  const game = await ctx.db.get(id)

  if (!game) {
    throw new ConvexError({
      message: "Ingen spill med den ID-en",
      code: 404,
      severity: "low",
    })
  }

  return game
}

async function assertGameAccess(
  ctx: QueryCtx | MutationCtx,
  gameId: Id<"games">
) {
  const user = await getCurrentUser(ctx)

  if (!user) {
    throw new ConvexError({
      message: "Du har ikke tilgang til dette spillet",
      code: 403,
      severity: "low",
    })
  }

  const participant = await ctx.db
    .query("gameParticipants")
    .withIndex("by_game_and_user", (q) =>
      q.eq("gameId", gameId).eq("playerId", user._id)
    )
    .first()

  if (!participant) {
    throw new ConvexError({
      message: "Du har ikke tilgang til dette spillet",
      code: 403,
      severity: "low",
    })
  }

  return participant
}

async function getRoundOrThrow(ctx: QueryCtx | MutationCtx, roundId: Id<"rounds">) {
  const round = await ctx.db.get(roundId)

  if (!round) {
    throw new ConvexError({
      message: "Fant ingen runde med den ID-en",
      code: 404,
      severity: "low",
    })
  }

  return round
}

export const hasAccess = query({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUser(ctx)

    if (!user) {
      return false
    }

    const participant = await ctx.db
      .query("gameParticipants")
      .withIndex("by_game_and_user", (q) =>
        q.eq("gameId", id).eq("playerId", user._id)
      )
      .first()

    return participant !== null
  },
})

export const getOverview = query({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, { id }) => {
    await assertGameAccess(ctx, id)
    const game = await getGameOrThrow(ctx, id)
    const location = await ctx.db.get(game.locationId)
    const rounds = await ctx.db
      .query("rounds")
      .withIndex("by_game", (q) => q.eq("gameId", id))
      .collect()

    return {
      gameId: game._id,
      gameMaster: game.gameMasterId,
      location: location!.name,
      type: game.type,
      winner: game.winnerId,
      rounds,
    }
  },
})

export const participants = query({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, { id }) => {
    await assertGameAccess(ctx, id)
    const currentGamePlayers = await ctx.db
      .query("gameParticipants")
      .withIndex("by_game", (q) => q.eq("gameId", id))
      .collect()

    if (!currentGamePlayers) {
      throw new ConvexError({
        message: `Ingen spillere tilknyttet spillet med id ${id}`,
        code: 400,
        severity: "low",
      })
    }

    const players = await Promise.all(
      currentGamePlayers.map(async (player) => {
        const user = await ctx.db.get(player.playerId)

        if (!user) {
          throw new ConvexError({
            message: `Ingen bruker tilknyttet spiller med id ${player.playerId}`,
            code: 400,
            severity: "low",
          })
        }

        return { ...player, ...user }
      })
    )

    return players
  },
})

export const getRoundScores = query({
  args: {
    roundId: v.id("rounds"),
  },
  handler: async (ctx, { roundId }) => {
    const round = await getRoundOrThrow(ctx, roundId)
    await assertGameAccess(ctx, round.gameId)

    const roundScores = await ctx.db
      .query("roundScores")
      .withIndex("by_round_and_user", (q) => q.eq("roundId", roundId))
      .collect()

    const scoresByPlayerId: Partial<Record<Id<"users">, number>> = {}

    for (const roundScore of roundScores ?? []) {
      scoresByPlayerId[roundScore.userId] = roundScore.score
    }

    return scoresByPlayerId
  },
})

export const getStandings = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, { gameId }) => {
    await assertGameAccess(ctx, gameId)
    const gameParticipants = await ctx.db
      .query("gameParticipants")
      .withIndex("by_game", (q) => q.eq("gameId", gameId))
      .collect()

    const rounds = await ctx.db
      .query("rounds")
      .withIndex("by_game", (q) => q.eq("gameId", gameId))
      .collect()

    const totalScoresByPlayerIds: Record<Id<"users">, number> = {}

    for (const participant of gameParticipants)
      totalScoresByPlayerIds[participant.playerId] = 0

    for (const round of rounds) {
      const roundScores = await ctx.db
        .query("roundScores")
        .withIndex("by_round_and_user", (q) => q.eq("roundId", round._id))
        .collect()

      for (const score of roundScores) {
        totalScoresByPlayerIds[score.userId] += score.score
      }
    }

    const standings: {
      id: Id<"users">
      name: string
      totalScore: number
    }[] = []

    for (const participant of gameParticipants) {
      const user = await ctx.db.get(participant.playerId)

      if (!user) {
        throw new ConvexError({
          message: `Ingen bruker tilknyttet spiller med id ${participant.playerId}`,
          code: 400,
          severity: "low",
        })
      }

      standings.push({
        id: participant.playerId,
        name: user.name,
        totalScore: totalScoresByPlayerIds[participant.playerId],
      })
    }

    return standings.sort((a, b) => a.totalScore - b.totalScore)
  },
})

export const upsertScore = mutation({
  args: {
    roundId: v.id("rounds"),
    playerId: v.id("users"),
    score: v.number(),
  },
  handler: async (ctx, { roundId, playerId, score }) => {
    const round = await getRoundOrThrow(ctx, roundId)
    await assertGameAccess(ctx, round.gameId)

    const roundScore = await ctx.db
      .query("roundScores")
      .withIndex("by_round_and_user", (q) =>
        q.eq("roundId", roundId).eq("userId", playerId)
      )
      .first()

    if (roundScore) {
      await ctx.db.patch("roundScores", roundScore._id, {
        score: score,
      })
    } else {
      await ctx.db.insert("roundScores", {
        userId: playerId,
        roundId,
        score,
      })
    }
  },
})

export const finishGame = mutation({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, { gameId }) => {
    await assertGameAccess(ctx, gameId)
    const winner = await ctx.runQuery(api.games.activeGame.getStandings, {
      gameId,
    })
    await ctx.db.patch("games", gameId, { winnerId: winner[0].id })
  },
})
