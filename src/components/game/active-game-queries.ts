import { convexQuery } from "@convex-dev/react-query"

import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"

export function activeGameQueries(gameId: Id<"games">) {
  return {
    game: convexQuery(api.games.getGameInfo, { gameId }),
    location: convexQuery(api.locations.getLocationOfGame, { gameId }),
    rounds: convexQuery(api.rounds.getRounds, { gameId }),
    roundScores: convexQuery(api.rounds.getParticipantsForRounds, { gameId }),
    standing: convexQuery(api.games.getGameStanding, { gameId }),
    user: convexQuery(api.users.getUser, {}),
  }
}
