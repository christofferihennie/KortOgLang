import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  games: defineTable({
    winnerId: v.optional(v.id("users")),
    locationId: v.id("locations"),
  }),

  gameParticipants: defineTable({
    gameId: v.id("games"),
    playerId: v.id("users"),
    finalPosition: v.optional(v.number()),
    finalScore: v.optional(v.number()),
  })
    .index("by_game", ["gameId"])
    .index("by_user", ["playerId"])
    .index("by_game_and_user", ["gameId", "playerId"]),

  rounds: defineTable({
    gameId: v.id("games"),
    roundNumber: v.number(),
    roundName: v.string(),
    winnerId: v.optional(v.id("users")),
  })
    .index("by_game", ["gameId"])
    .index("by_game_and_round", ["gameId", "roundNumber"])
    .index("by_winner", ["winnerId"]),

  roundScores: defineTable({
    roundId: v.id("rounds"),
    userId: v.id("users"),
    score: v.number(),
    cardsRemaining: v.optional(v.number()),
  })
    .index("by_round", ["roundId"])
    .index("by_user", ["userId"])
    .index("by_round_and_user", ["roundId", "userId"]),

  locations: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
});
