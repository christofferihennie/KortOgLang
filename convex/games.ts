import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

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

export const getActiveGames = query({
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

    const gameIds = participations.map(p => p.gameId);
    const allGames = await Promise.all(
      gameIds.map(gameId => ctx.db.get(gameId))
    );

    const activeGames = allGames.filter((game): game is NonNullable<typeof game> =>
      game !== null && game.winnerId === undefined
    );

    if (activeGames.length === 0) return [];

    const activeGameIds = activeGames.map(game => game._id);
    const allParticipations = await Promise.all(
      activeGameIds.map(gameId =>
        ctx.db
          .query("gameParticipants")
          .withIndex("by_game", (q) => q.eq("gameId", gameId))
          .collect()
      )
    );

    const allPlayerIds = new Set<Id<"users">>(
      allParticipations.flat().map(p => p.playerId)
    );
    const locationIds = new Set<Id<"locations">>(
      activeGames.map(game => game.locationId)
    );

    const [allPlayers, allLocations] = await Promise.all([
      Promise.all(Array.from(allPlayerIds).map(id => ctx.db.get(id))),
      Promise.all(Array.from(locationIds).map(id => ctx.db.get(id)))
    ]);

    const playerMap = new Map<string, Doc<"users">>(
      allPlayers
        .filter((player): player is NonNullable<typeof player> => player !== null)
        .map(player => [player._id, player])
    );

    const locationMap = new Map<string, Doc<"locations">>(
      allLocations
        .filter((location): location is NonNullable<typeof location> => location !== null)
        .map(location => [location._id, location])
    );

    const results = activeGames.map((game, index) => {
      const gameParticipations = allParticipations[index];
      const participants = gameParticipations
        .map(p => playerMap.get(p.playerId))
        .filter((player): player is NonNullable<typeof player> => player !== null)
        .map(player => ({ id: player._id, name: player.name }));

      const location = locationMap.get(game.locationId);

      return {
        participants,
        location,
        ...game,
      };
    });

    return results.sort((a, b) => b._creationTime - a._creationTime);
  }
})

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
