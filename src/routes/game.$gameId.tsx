import { Header } from "@/components/common/header"
import { buttonVariants } from "@/components/ui/button"
import { FinishGame } from "@/features/game/finish-game"
import { Podium } from "@/features/game/podium"
import { Rounds } from "@/features/game/rounds"
import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
  Link,
  Navigate,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute("/game/$gameId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const gameId = params.gameId as Id<"games">

    if (!context.isAuthenticated) {
      throw redirect({ to: "/", search: { accessDenied: "1" } })
    }

    const hasAccess = await context.queryClient.ensureQueryData(
      convexQuery(api.games.activeGame.hasAccess, { id: gameId })
    )

    if (!hasAccess) {
      throw redirect({ to: "/", search: { accessDenied: "1" } })
    }

    await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.games.activeGame.getOverview, { id: gameId })
      ),
      context.queryClient.ensureQueryData(
        convexQuery(api.games.activeGame.participants, { id: gameId })
      ),
    ])
  },
})

function RouteComponent() {
  const { gameId } = Route.useParams() as { gameId: Id<"games"> }

  const { data: game } = useSuspenseQuery(
    convexQuery(api.games.activeGame.getOverview, { id: gameId })
  )

  const { data: participants } = useSuspenseQuery(
    convexQuery(api.games.activeGame.participants, { id: gameId })
  )

  if (game.winner) {
    return <Navigate to="/" />
  }

  return (
    <>
      <Header title={game.location}>
        <Link
          to=".."
          className={buttonVariants({ variant: "link", size: "icon" })}
        >
          <ArrowLeftIcon className="size-6 text-foreground" />
        </Link>
      </Header>
      <main className="space-y-4">
        <Podium gameId={gameId} />
        <Rounds
          players={participants.map((participant) => ({
            id: participant._id,
            name: participant.name,
            color: participant.gameColor,
          }))}
          gameMaster={game.gameMaster}
          type={game.type}
          rounds={game.rounds}
        />
        <FinishGame gameId={gameId} />
      </main>
    </>
  )
}
