import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUserGames = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }

    const participations = await ctx.db
      .query("gameParticipants")
      .withIndex("by_user", (q) => q.eq("playerId", user._id))
      .collect();

    const games = await Promise.all(
      participations.map(async (participation) => {
        const game = await ctx.db.get(participation.gameId);
        if (!game) return null;

        const participants = await ctx.db
          .query("gameParticipants")
          .withIndex("by_game", (q) => q.eq("gameId", game._id))
          .collect();

        const num_participants = participants?.length;

        const winner = game.winnerId ? await ctx.db.get(game.winnerId) : null;
        const winner_name = winner?.name ?? "Ukjent";

        const location = await ctx.db.get(game.locationId);

        return {
          num_participants,
          winner_name,
          location,
          ...game,
        };
      }),
    );

    return games.filter((game) => game !== null);
  },
});

export const createGame = mutation({
  args: {
    players: v.array(v.id("users")),
    location: v.id("locations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }

    const createEvent = await ctx.db.insert("games", {
      locationId: args.location,
    });

    const gameParticipants = [...args.players, user._id];

    gameParticipants.map((player) =>
      ctx.db.insert("gameParticipants", {
        gameId: createEvent,
        playerId: player,
      }),
    );

    return true;
  },
});
