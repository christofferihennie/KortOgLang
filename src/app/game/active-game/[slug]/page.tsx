import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import FinishGame from "./finishGame";
import Podium from "./podium";
import RoundTracker from "./rounds-tracker";

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gameId = slug as Id<"games">;

  const location = await fetchQuery(api.locations.getLocationOfGame, {
    gameId: gameId,
  });

  const rounds = await preloadQuery(api.rounds.getRounds, {
    gameId: slug as Id<"games">,
  });

  return (
    <div className="flex flex-col h-full">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
        {location?.name || "Ukjent"}
      </h2>
      <Podium gameId={gameId} />
      <p className="leading-7">Runde: </p>
      <div className="flex-1">
        <RoundTracker preloadedRounds={rounds} />
      </div>
      <FinishGame gameId={gameId} />
    </div>
  );
}
