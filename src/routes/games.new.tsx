import { Header } from "@/components/common/header"
import { buttonVariants } from "@/components/ui/button"
import { NewGameForm } from "@/features/new-game/new-game-form"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { api } from "convex/_generated/api"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute("/games/new")({
  component: RouteComponent,
  loader: async (opts) => {
    await Promise.all([
      opts.context.queryClient.ensureQueryData(
        convexQuery(api.games.createGame.getLocations, {})
      ),
      opts.context.queryClient.prefetchQuery(
        convexQuery(api.games.createGame.getPossiblePlayers, {})
      ),
    ])
  },
})

function RouteComponent() {
  const { data: locations } = useSuspenseQuery(
    convexQuery(api.games.createGame.getLocations, {})
  )

  const { data: possiblePlayers } = useQuery(
    convexQuery(api.games.createGame.getPossiblePlayers, {})
  )

  return (
    <main>
      <Header title="Start et nytt spill" subtitle="Fyll ut for å komme igang">
        <Link
          to="/"
          className={buttonVariants({ variant: "link", size: "icon" })}
        >
          <ArrowLeftIcon className="size-6 text-foreground" />
        </Link>
      </Header>
      <NewGameForm locations={locations} players={possiblePlayers} />
    </main>
  )
}
