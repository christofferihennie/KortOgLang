import { ConvexError, v } from "convex/values"
import { Id } from "../_generated/dataModel"
import { query, QueryCtx } from "../_generated/server"

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

export const getOverview = query({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, { id }) => {
    const game = await getGameOrThrow(ctx, id)
    const location = await ctx.db.get(game.locationId)

    return {
      gameId: game._id,
      gameMaster: game.gameMaster,
      location: location!.name,
    }
  },
})

export const participants = query({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, { id }) => {
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

    return currentGamePlayers
  },
})
