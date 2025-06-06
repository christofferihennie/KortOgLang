import { v } from "convex/values";
import { query } from "./_generated/server";

export const getLocations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("locations").collect();
  },
});

export const getLocationOfGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, { gameId }) => {
    const game = await ctx.db.get(gameId);
    if (!game) return null;
    return await ctx.db.get(game.locationId);
  },
});
