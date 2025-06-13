import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    gameColor: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  games: defineTable({
    winnerId: v.optional(v.id("users")),
    locationId: v.id("locations"),
    type: v.union(v.literal("7 runder"), v.literal("9 runder")),
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
  }).index("by_game", ["gameId"]),

  roundScores: defineTable({
    roundId: v.id("rounds"),
    userId: v.id("users"),
    score: v.number(),
    cardsRemaining: v.optional(v.number()),
  }).index("by_round", ["roundId"]),

  locations: defineTable({
    name: v.string(),
  }),
});
