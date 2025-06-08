import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getRounds = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const rounds = await ctx.db
      .query("rounds")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    return rounds;
  },
});

export const getParticipantsForRounds = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const rounds = await ctx.db
      .query("rounds")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    const result = [];
    for (const round of rounds) {
      const roundScores = await ctx.db
        .query("roundScores")
        .withIndex("by_round", (q) => q.eq("roundId", round._id))
        .collect();

      const users: Doc<"users">[] = [];
      for (const u of roundScores.map((p) => p.userId)) {
        const user = await ctx.db.get(u);
        if (!user) continue;
        users.push(user);
      }

      result.push({
        roundId: round._id,
        roundNumber: round.roundNumber,
        roundName: round.roundName,
        scores: roundScores.map((score) => ({
          _id: score._id,
          userId: score.userId,
          userInfo: users.find((u) => u._id === score.userId),
          score: score.score,
        })),
      });
    }

    return result;
  },
});

export const updateScore = mutation({
  args: { roundScoreId: v.id("roundScores"), score: v.number() },
  handler: async (ctx, args) => {
    const roundScore = await ctx.db.get(args.roundScoreId);
    if (!roundScore) throw new Error("Round score not found");

    await ctx.db.patch(roundScore._id, {
      score: args.score,
    });
  },
});
