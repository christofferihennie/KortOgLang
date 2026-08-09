import { createFileRoute } from "@tanstack/react-router"

import { NewGameForm } from "@/components/game/new-game-form"
import { locationsQuery, usersQuery } from "@/components/game/new-game-queries"

export { locationsQuery, usersQuery }

export const Route = createFileRoute("/game/new-game")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(locationsQuery),
      context.queryClient.ensureQueryData(usersQuery),
    ])
  },
  component: NewGamePage,
})

function NewGamePage() {
  return <NewGameForm />
}
