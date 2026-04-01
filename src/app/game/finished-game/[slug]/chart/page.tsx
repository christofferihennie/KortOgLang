import { preloadQuery } from "convex/nextjs";
import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import { Header } from "@/components/ui/header";
import PointsChart from "./points-chart";

export default async function PointsChartPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const gameId = slug as Id<"games">;

    const preloadedRoundScores = await preloadQuery(api.rounds.getParticipantsForRounds, {
        gameId,
    });

    return (
        <div className='flex flex-col h-full'>
            <Header backButton={true}>Spillets utvikling</Header>

            <PointsChart preloadedRoundScores={preloadedRoundScores} />
        </div>
    );
}
