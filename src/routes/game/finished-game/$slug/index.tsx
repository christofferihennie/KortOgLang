import { createFileRoute, Link } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"

import { activeGameQueries } from "@/components/game/active-game-queries"
import { FinishedGameLoading } from "@/components/game/finished-game-loading"
import { FinishedRoundStats } from "@/components/game/finished-round-stats"
import { Podium } from "@/components/game/podium"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import type { Id } from "../../../../../convex/_generated/dataModel"

export const Route = createFileRoute("/game/finished-game/$slug/")({
  loader: async ({ context, params }) => {
    const gameId = params.slug as Id<"games">
    const queries = activeGameQueries(gameId)

    await Promise.all([
      context.queryClient.ensureQueryData(queries.game),
      context.queryClient.ensureQueryData(queries.location),
      context.queryClient.ensureQueryData(queries.rounds),
      context.queryClient.ensureQueryData(queries.roundScores),
      context.queryClient.ensureQueryData(queries.standing),
    ])
  },
  pendingComponent: FinishedGameLoading,
  errorComponent: FinishedGameError,
  component: FinishedGamePage,
})

function FinishedGamePage() {
  const { slug } = Route.useParams()
  const gameId = slug as Id<"games">
  const { data: location } = useSuspenseQuery(
    activeGameQueries(gameId).location
  )

  return (
    <div className="flex h-full flex-col">
      <Header backButton>{location?.name ?? "Ukjent"}</Header>
      <Podium gameId={gameId} />
      <Button
        className="my-4 w-fit"
        render={<Link to="/game/finished-game/$slug/chart" params={{ slug }} />}
      >
        Se utvikling
      </Button>
      <p className="leading-7">Runde:</p>
      <FinishedRoundStats gameId={gameId} />
    </div>
  )
}

function FinishedGameError({ error }: { error: Error }) {
  return (
    <div className="space-y-2">
      <Header backButton>Spill</Header>
      <p className="text-destructive">
        Kunne ikke laste spillet: {error.message}
      </p>
    </div>
  )
}
