import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import { Header } from "@/components/ui/header";
import Podium from "@/components/ui/podium";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import FinishGame from "./finishGame";
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
      <Header backButton={true}>{location?.name || "Ukjent"}</Header>
      <Podium gameId={gameId} />
      <p className="leading-7">Runde: </p>
      <div className="flex-1 mb-4">
        <RoundTracker preloadedRounds={rounds} />
      </div>
      <FinishGame gameId={gameId} />
    </div>
  );
}
