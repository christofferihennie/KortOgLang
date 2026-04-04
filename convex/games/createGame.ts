import { v } from "convex/values"
import { DEFAULT_GAME_TYPE, ROUND_NAMES } from "../../shared/game"
import { mutation, query } from "../_generated/server"
import { getCurrentUserOrThrow } from "../auth"

export const getLocations = query({
  args: {},
  handler: async (ctx) => {
    const locations = await ctx.db.query("locations").collect()

    return locations.map((location) => ({
      value: location._id,
      label: location.name,
    }))
  },
})

export const getPossiblePlayers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect()

    return users.map((user) => ({
      value: user._id,
      label: user.name,
    }))
  },
})

export const createGame = mutation({
  args: {
    location: v.id("locations"),
    gameMaster: v.boolean(),
    players: v.array(v.id("users")),
  },
  handler: async (ctx, { location, gameMaster, players }) => {
    const current = await getCurrentUserOrThrow(ctx)

    const game = await ctx.db.insert("games", {
      locationId: location,
      type: DEFAULT_GAME_TYPE,
      gameMaster,
    })

    const user = await ctx.db
      .query("users")
      .withIndex("by_betterAuthId", (q) =>
        q.eq("betterAuthId", current.subject)
      )
      .first()

    console.info(user)

    await Promise.all(
      players.map(async (player) => {
        return await ctx.db.insert("gameParticipants", {
          gameId: game,
          playerId: player,
          gameMaster: player === user?._id,
        })
      })
    )

    await Promise.all(
      ROUND_NAMES.map(async (round, idx) => {
        return await ctx.db.insert("rounds", {
          gameId: game,
          roundName: round,
          roundNumber: idx,
        })
      })
    )

    return game
  },
})
