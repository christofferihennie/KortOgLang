import { v } from "convex/values";
import { round_names_7, round_names_9 } from "../shared/constants/rounds";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getFinishedGames = query({
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

    const allGames = await Promise.all(
      participations.map((participation) => ctx.db.get(participation.gameId)),
    );

    const finishedGamesWithParticipation = allGames
      .map((game, index) =>
        game && game.winnerId !== undefined
          ? { game, participation: participations[index] }
          : null,
      )
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.game._creationTime - a.game._creationTime)
      .slice(0, 10);

    if (finishedGamesWithParticipation.length === 0) {
      return [];
    }

    const gameIds = finishedGamesWithParticipation.map(({ game }) => game._id);
    const winnerIds = finishedGamesWithParticipation
      .map(({ game }) => game.winnerId)
      .filter(
        (winnerId): winnerId is NonNullable<typeof winnerId> =>
          winnerId !== undefined,
      );
    const locationIds = finishedGamesWithParticipation.map(
      ({ game }) => game.locationId,
    );

    const [allParticipants, allWinners, allLocations] = await Promise.all([
      Promise.all(
        gameIds.map((gameId) =>
          ctx.db
            .query("gameParticipants")
            .withIndex("by_game", (q) => q.eq("gameId", gameId))
            .collect(),
        ),
      ),
      Promise.all(winnerIds.map((winnerId) => ctx.db.get(winnerId))),
      Promise.all(locationIds.map((locationId) => ctx.db.get(locationId))),
    ]);

    return finishedGamesWithParticipation.map(
      ({ game, participation }, index) => ({
        num_participants: allParticipants[index]?.length ?? 0,
        participation,
        winner_name: allWinners[index]?.name ?? "Ukjent",
        location: allLocations[index],
        ...game,
      }),
    );
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

    const gameIds = participations.map((p) => p.gameId);
    const allGames = await Promise.all(
      gameIds.map((gameId) => ctx.db.get(gameId)),
    );

    const activeGames = allGames.filter(
      (game): game is NonNullable<typeof game> =>
        game !== null && game.winnerId === undefined,
    );

    if (activeGames.length === 0) return [];

    const activeGameIds = activeGames.map((game) => game._id);
    const allParticipations = await Promise.all(
      activeGameIds.map((gameId) =>
        ctx.db
          .query("gameParticipants")
          .withIndex("by_game", (q) => q.eq("gameId", gameId))
          .collect(),
      ),
    );

    const [allPlayers, allLocations] = await Promise.all([
      Promise.all(
        allParticipations
          .flat()
          .map((participant) => ctx.db.get(participant.playerId)),
      ),
      Promise.all(
        activeGames.map((game) => game.locationId).map((id) => ctx.db.get(id)),
      ),
    ]);

    const playerMap = new Map<string, Doc<"users">>(
      allPlayers
        .filter((player) => player !== null)
        .map((player) => [player._id, player]),
    );

    const locationMap = new Map<string, Doc<"locations">>(
      allLocations
        .filter(
          (location): location is NonNullable<typeof location> =>
            location !== null,
        )
        .map((location) => [location._id, location]),
    );

    const results = activeGames.map((game, index) => {
      const gameParticipations = allParticipations[index];
      const participants = gameParticipations
        .map((p) => playerMap.get(p.playerId))
        .filter(
          (player): player is NonNullable<typeof player> => player !== null,
        )
        .map((player) => ({ id: player._id, name: player.name }));

      const location = locationMap.get(game.locationId);

      return {
        participants,
        location,
        ...game,
      };
    });

    return results
      .filter((game) => game !== undefined)
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const createGame = mutation({
  args: {
    players: v.array(v.id("users")),
    location: v.id("locations"),
    gameType: v.union(v.literal("7 runder"), v.literal("9 runder")),
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
      type: args.gameType,
    });

    const ant_rounds = args.gameType === "9 runder" ? 9 : 7;
    const round_names =
      args.gameType === "9 runder" ? round_names_9 : round_names_7;

    const rounds: Id<"rounds">[] = [];
    for (const round of round_names.slice(0, ant_rounds)) {
      const round_id = await ctx.db.insert("rounds", {
        gameId: createEvent,
        roundName: round,
        roundNumber: round_names.indexOf(round) + 1,
      });
      rounds.push(round_id);
    }

    if (rounds.length !== ant_rounds) {
      throw new Error("Failed to create rounds");
    }

    const users = [...args.players, user._id];

    const participants: Id<"gameParticipants">[] = [];
    for (const u of users) {
      const participant = await ctx.db.insert("gameParticipants", {
        gameId: createEvent,
        playerId: u,
      });
      participants.push(participant);
    }

    const roundScores: Id<"roundScores">[] = [];
    for (const round of rounds) {
      for (const u of users) {
        const score = await ctx.db.insert("roundScores", {
          userId: u,
          roundId: round,
          score: 0,
        });
        roundScores.push(score);
      }
    }

    return {
      gameId: createEvent,
    };
  },
});

export const finishGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get<"games">(args.gameId);
    if (!game) throw new Error("Game not found");

    const rounds = await ctx.db
      .query("rounds")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    const scores = await Promise.all(
      rounds.map(async (round) => {
        const roundScores = await ctx.db
          .query("roundScores")
          .withIndex("by_round", (q) => q.eq("roundId", round._id))
          .collect();

        const playerScores = roundScores.reduce(
          (acc, score) => {
            acc[score.userId] = score.score;
            return acc;
          },
          {} as Record<Id<"users">, number>,
        );

        return playerScores;
      }),
    );

    const totalScores = scores.reduce(
      (acc, playerScores) => {
        for (const [userId, score] of Object.entries(playerScores)) {
          acc[userId as Id<"users">] =
            (acc[userId as Id<"users">] || 0) + score;
        }
        return acc;
      },
      {} as Record<Id<"users">, number>,
    );

    const standings = Object.entries(totalScores).sort((a, b) => a[1] - b[1]);
    await ctx.db.patch(game._id, {
      winnerId: standings[0][0] as Id<"users">,
    });

    await Promise.all(
      standings.map(async (entry, index) => {
        const participant = await ctx.db
          .query("gameParticipants")
          .withIndex("by_game_and_user", (q) =>
            q.eq("gameId", game._id).eq("playerId", entry[0] as Id<"users">),
          )
          .collect();

        await ctx.db.patch(participant[0]._id, {
          finalScore: entry[1],
          finalPosition: index + 1,
        });
      }),
    );
  },
});

export const getGameStanding = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const rounds = await ctx.db
      .query("rounds")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    const scores = await Promise.all(
      rounds.map(async (round) => {
        const roundScores = await ctx.db
          .query("roundScores")
          .withIndex("by_round", (q) => q.eq("roundId", round._id))
          .collect();

        const playerScores = roundScores.reduce(
          (acc, score) => {
            acc[score.userId] = score.score;
            return acc;
          },
          {} as Record<Id<"users">, number>,
        );

        return playerScores;
      }),
    );

    const totalScores = scores.reduce(
      (acc, playerScores) => {
        for (const [userId, score] of Object.entries(playerScores)) {
          acc[userId as Id<"users">] =
            (acc[userId as Id<"users">] || 0) + score;
        }
        return acc;
      },
      {} as Record<Id<"users">, number>,
    );

    const userIds = Object.keys(totalScores) as Id<"users">[];
    const users = await Promise.all(
      userIds.map((userId) => ctx.db.get(userId)),
    );

    const standings = userIds
      .map((userId, index) => ({
        userId,
        user: users[index],
        totalScore: totalScores[userId],
      }))
      .sort((a, b) => a.totalScore - b.totalScore);

    return standings;
  },
});
