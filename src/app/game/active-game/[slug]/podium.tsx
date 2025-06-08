"use client";

import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import { useQuery } from "convex/react";

export default function Podium({ gameId }: { gameId: Id<"games"> }) {
  const standing = useQuery(api.games.getGameStanding, {
    gameId: gameId,
  });

  if (!standing) {
    return <div>Loading...</div>;
  }

  const playersWithPositions = standing.map((player) => {
    const playersAhead = standing.filter(
      (p) => (p.totalScore || 0) < (player.totalScore || 0),
    ).length;
    const position = playersAhead + 1;
    return { ...player, position };
  });

  // Get podium players (positions 1, 2, 3)
  const firstPlace = playersWithPositions.filter((p) => p.position === 1);
  const secondPlace = playersWithPositions.filter((p) => p.position === 2);
  const thirdPlace = playersWithPositions.filter((p) => p.position === 3);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 items-end gap-2 w-3/4 my-6">
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center text-center min-h-[20px]">
            {secondPlace.map((player, index) => (
              <p
                key={player.user?.name || `second-${index}`}
                className="text-sm"
              >
                {player.user?.name.split(" ")[0] || "Ukjent"}
              </p>
            ))}
          </div>
          <div className="h-20 w-10 bg-slate-400 text-primary-foreground rounded-t-md rounded-b-sm text-center py-1">
            <p className="text-xl">2.</p>
            <p className="text-sm">{secondPlace[0]?.totalScore || "0"}p</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center text-center min-h-[20px]">
            {firstPlace.map((player, index) => (
              <p
                key={player.user?.name || `first-${index}`}
                className="text-sm font-semibold"
              >
                {player.user?.name.split(" ")[0] || "Ukjent"}
              </p>
            ))}
          </div>
          <div className="h-28 w-12 bg-amber-300 text-primary-foreground rounded-t-md rounded-b-sm text-center py-1">
            <p className="text-xl">1.</p>
            <p className="text-sm">{firstPlace[0]?.totalScore || "0"}p</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center text-center min-h-[20px]">
            {thirdPlace.map((player, index) => (
              <p
                key={player.user?.name || `third-${index}`}
                className="text-sm"
              >
                {player.user?.name.split(" ")[0] || "Ukjent"}
              </p>
            ))}
          </div>
          <div className="h-14 w-10 bg-yellow-900 text-neutral-100 rounded-t-md rounded-b-sm text-center py-0.5">
            <p className="text-xl">3.</p>
            <p className="text-sm">{thirdPlace[0]?.totalScore || "0"}p</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {playersWithPositions
          .filter((p) => p.position > 3)
          .map((player) => (
            <p
              key={player.user?.name || `player-${player.position}`}
              className="leading-7"
            >
              {player.position}. {player.user?.name.split(" ")[0] || "Ukjent"} -{" "}
              {player.totalScore || "0"} poeng
            </p>
          ))}
      </div>
    </div>
  );
}
