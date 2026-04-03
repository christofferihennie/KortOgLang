import { Header } from "@/components/common/header"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/games/new")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <Header
        title="Start et nytt spill"
        subtitle="Fyll ut for å komme igang"
      />
    </main>
  )
}
