import { createFileRoute } from "@tanstack/react-router"

import { allFinishedGamesQuery, PlayedGames } from "@/components/played-games"
import { FinishedGamesLoading } from "@/components/game/finished-games-loading"
import { Header } from "@/components/ui/header"

export const Route = createFileRoute("/game/finished-games")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(allFinishedGamesQuery)
  },
  pendingComponent: FinishedGamesLoading,
  errorComponent: FinishedGamesError,
  component: FinishedGamesPage,
})

function FinishedGamesPage() {
  return (
    <div className="flex h-full flex-col">
      <Header backButton>Alle dine fullførte spill</Header>
      <PlayedGames />
    </div>
  )
}

function FinishedGamesError({ error }: { error: Error }) {
  return (
    <div className="space-y-2">
      <Header backButton>Alle dine fullførte spill</Header>
      <p className="text-destructive">
        Kunne ikke laste ferdigspilte spill: {error.message}
      </p>
    </div>
  )
}
