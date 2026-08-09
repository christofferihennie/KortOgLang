import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"

import { activeGameQueries } from "@/components/game/active-game-queries"
import { ActiveGameLoading } from "@/components/game/active-game-loading"
import { FinishGameDialog } from "@/components/game/finish-game-dialog"
import { Podium } from "@/components/game/podium"
import { RoundTracker } from "@/components/game/round-tracker"
import { Header } from "@/components/ui/header"
import type { Id } from "../../../../convex/_generated/dataModel"

export const Route = createFileRoute("/game/active-game/$slug")({
  loader: async ({ context, params }) => {
    const gameId = params.slug as Id<"games">
    const queries = activeGameQueries(gameId)

    await Promise.all([
      context.queryClient.ensureQueryData(queries.game),
      context.queryClient.ensureQueryData(queries.location),
      context.queryClient.ensureQueryData(queries.rounds),
      context.queryClient.ensureQueryData(queries.roundScores),
      context.queryClient.ensureQueryData(queries.standing),
      context.queryClient.ensureQueryData(queries.user),
    ])
  },
  pendingComponent: ActiveGameLoading,
  errorComponent: ActiveGameError,
  component: ActiveGamePage,
})

function ActiveGamePage() {
  const { slug } = Route.useParams()
  const gameId = slug as Id<"games">
  const { data: location } = useSuspenseQuery(
    activeGameQueries(gameId).location
  )

  return (
    <div className="flex h-full flex-col">
      <Header backButton>{location?.name ?? "Ukjent"}</Header>
      <Podium gameId={gameId} />
      <p className="leading-7">Runde:</p>
      <div className="mb-4 flex-1">
        <RoundTracker gameId={gameId} />
      </div>
      <FinishGameDialog gameId={gameId} />
    </div>
  )
}

function ActiveGameError({ error }: { error: Error }) {
  return (
    <div className="space-y-2">
      <Header backButton>Spill</Header>
      <p className="text-destructive">
        Kunne ikke laste spillet: {error.message}
      </p>
    </div>
  )
}
