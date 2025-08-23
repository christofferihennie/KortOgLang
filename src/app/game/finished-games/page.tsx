"use client";

import PlayedGames from "@/components/played-games";
import { Header } from "@/components/ui/header";

export default function FinishedGamesPage() {
	return (
		<div className="flex flex-col h-full">
			<Header backButton={true}>Alle dine fullførte spill</Header>
			<PlayedGames />
		</div>
	)
}
