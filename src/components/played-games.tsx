"use client";

import { api } from "#/_generated/api";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { humanReadableDate } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import LoadingTable from "./loading/table";

export default function PlayedGames({ n }: { n?: number }) {
	const finishedGames = useQuery(api.games.getFinishedGames, { n });
	const router = useRouter();

	if (!finishedGames) {
		return <LoadingTable n={n} />;
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Dato</TableHead>
						<TableHead>Ditt resultat</TableHead>
						<TableHead>Vinner</TableHead>
						<TableHead>Ant. spillere</TableHead>
						<TableHead>Sted</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{finishedGames?.map((game) => (
						<TableRow
							key={game._id}
							className="cursor-pointer"
							onClick={() => router.push(`/game/finished-game/${game._id}`)}
						>
							<TableCell>
								{humanReadableDate(new Date(game._creationTime))}
							</TableCell>
							<TableCell>
								{game.participation.finalPosition || "0"}. med{" "}
								{game.participation.finalScore || "-"} poeng
							</TableCell>
							<TableCell>{game.winner_name}</TableCell>
							<TableCell>{game.num_participants}</TableCell>
							<TableCell>{game.location?.name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
