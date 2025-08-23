import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import { Header } from "@/components/ui/header";
import Podium from "@/components/ui/podium";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import RoundStats from "./rounds";
import { LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
			<Button className="w-fit my-4" asChild>
				<Link href={`/game/finished-game/${gameId}/chart`}>
					<LineChart />Se utvikling
				</Link>
			</Button>
			<p className="leading-7">Runde: </p>
			<RoundStats preloadedRounds={rounds} />
		</div>
	);
}
