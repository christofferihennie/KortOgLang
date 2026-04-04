import { Header } from "@/components/common/header"
import { buttonVariants } from "@/components/ui/button"
import { Podium } from "@/features/game/podium"
import { Rounds } from "@/features/game/rounds"
import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute("/game/$gameId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const gameId = params.gameId as Id<"games">
    await context.queryClient.ensureQueryData(
      convexQuery(api.games.activeGame.getOverview, { id: gameId })
    )
  },
})

function RouteComponent() {
  const { gameId } = Route.useParams()

  const { data: game } = useSuspenseQuery(
    convexQuery(api.games.activeGame.getOverview, { id: gameId as Id<"games"> })
  )

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
        <Podium />
        <Rounds />
      </main>
    </>
  )
}
