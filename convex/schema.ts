import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { GAME_TYPES } from "../shared/game"

const [sevenRoundGameType, nineRoundGameType] = GAME_TYPES

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.optional(v.string()),
    betterAuthId: v.optional(v.string()),
    gameColor: v.string(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_betterAuthId", ["betterAuthId"]),

  games: defineTable({
    winnerId: v.optional(v.id("users")),
    locationId: v.id("locations"),
    type: v.union(v.literal(sevenRoundGameType), v.literal(nineRoundGameType)),
    gameMaster: v.optional(v.boolean()),
    gameMasterId: v.optional(v.id("users")),
  }),

  gameParticipants: defineTable({
    gameId: v.id("games"),
    playerId: v.id("users"),
    finalPosition: v.optional(v.number()),
    finalScore: v.optional(v.number()),
    gameMaster: v.optional(v.boolean()),
  })
    .index("by_game", ["gameId"])
    .index("by_user", ["playerId"])
    .index("by_game_and_user", ["gameId", "playerId"]),

  rounds: defineTable({
    gameId: v.id("games"),
    roundNumber: v.number(),
    roundName: v.optional(v.string()),
  }).index("by_game", ["gameId"]),

  roundScores: defineTable({
    roundId: v.id("rounds"),
    userId: v.id("users"),
    score: v.number(),
  }).index("by_round_and_user", ["roundId", "userId"]),

  locations: defineTable({
    name: v.string(),
  }),
})
