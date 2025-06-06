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

  const [first, second, third] = standing.slice(0, 3);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 items-end gap-2 w-3/4 my-6">
        <div className="flex flex-col items-center">
          <p>{second?.user?.name.split(" ")[0] || "Ukjent"}</p>
          <div className="h-12 w-10 bg-slate-400 text-primary-foreground rounded-t-md rounded-b-sm text-center py-1">
            2.
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p>{first?.user?.name.split(" ")[0] || "Ukjent"}</p>
          <div className="h-20 w-12 bg-amber-300 text-primary-foreground rounded-t-md rounded-b-sm text-center py-1">
            1.
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p>{third ? third.user?.name.split(" ")[0] || "Ukjent" : ""}</p>
          <div className="h-8 w-10 bg-yellow-900 text-neutral-100 rounded-t-md rounded-b-sm text-center py-0.5">
            3.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {standing.length > 3 &&
          standing.slice(3).map((player, index) => (
            <p
              key={player.user?.name || `player-${index + 4}`}
              className="leading-7"
            >
              {index + 4}. {player.user?.name.split(" ")[0] || "Ukjent"}
            </p>
          ))}
      </div>
    </div>
  );
}
