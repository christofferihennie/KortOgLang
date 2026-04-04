import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/games/history")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/history"!</div>
}
