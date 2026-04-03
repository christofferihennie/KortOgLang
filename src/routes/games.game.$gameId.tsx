import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/games/game/$gameId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { gameId } = Route.useParams()

  return <div>Hello "/games/game/$gameId"! Game Id = {gameId}</div>
}
