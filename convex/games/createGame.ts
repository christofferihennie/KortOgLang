import { v } from "convex/values"
import { GAME_TYPES, GAME_TYPE_MAPPING } from "../../shared/game"
import { mutation, query } from "../_generated/server"
import { getCurrentUser } from "../auth"

const [sevenRoundGameType, nineRoundGameType] = GAME_TYPES

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
    type: v.union(v.literal(sevenRoundGameType), v.literal(nineRoundGameType)),
  },
  handler: async (ctx, { location, gameMaster, players, type }) => {
    const user = await getCurrentUser(ctx)

    const game = await ctx.db.insert("games", {
      locationId: location,
      type,
      gameMasterId: gameMaster ? user?._id : undefined,
    })

    await Promise.all(
      players.map(async (player) => {
        return await ctx.db.insert("gameParticipants", {
          gameId: game,
          playerId: player,
        })
      })
    )

    await Promise.all(
      GAME_TYPE_MAPPING[type].map(async (_round, idx) => {
        return await ctx.db.insert("rounds", {
          gameId: game,
          roundNumber: idx,
        })
      })
    )

    return game
  },
})
