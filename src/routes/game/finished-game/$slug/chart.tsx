import { createFileRoute } from "@tanstack/react-router"

import { activeGameQueries } from "@/components/game/active-game-queries"
import { FinishedGameChart } from "@/components/game/finished-game-chart"
import { FinishedGameLoading } from "@/components/game/finished-game-loading"
import { Header } from "@/components/ui/header"
import type { Id } from "../../../../../convex/_generated/dataModel"

export const Route = createFileRoute("/game/finished-game/$slug/chart")({
  loader: async ({ context, params }) => {
    const gameId = params.slug as Id<"games">
    await context.queryClient.ensureQueryData(
      activeGameQueries(gameId).roundScores
    )
  },
  pendingComponent: FinishedGameLoading,
  errorComponent: FinishedGameError,
  component: FinishedGameChartPage,
})

function FinishedGameChartPage() {
  const { slug } = Route.useParams()
  const gameId = slug as Id<"games">

  return (
    <div className="flex h-full flex-col">
      <Header backButton>Spillets utvikling</Header>
      <FinishedGameChart gameId={gameId} />
    </div>
  )
}

function FinishedGameError({ error }: { error: Error }) {
  return (
    <div className="space-y-2">
      <Header backButton>Spillets utvikling</Header>
      <p className="text-destructive">
        Kunne ikke laste spillets utvikling: {error.message}
      </p>
    </div>
  )
}
