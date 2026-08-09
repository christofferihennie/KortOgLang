import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/game/finished-game/$slug")({
  component: () => <Outlet />,
})
