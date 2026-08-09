import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { ActiveGames, activeGamesQuery } from "@/components/active-games"
import { DashboardLoading } from "@/components/dashboard-loading"
import {
  PlayedGames,
  recentFinishedGamesQuery,
} from "@/components/played-games"
import { Separator } from "@/components/ui/separator"
export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(activeGamesQuery),
      context.queryClient.ensureQueryData(recentFinishedGamesQuery),
    ])
  },
  pendingComponent: DashboardLoading,
  component: App,
})

function App() {
  const { data: activeGames } = useSuspenseQuery(activeGamesQuery)
  const { data: finishedGames } = useSuspenseQuery(recentFinishedGamesQuery)

  return (
    <main>
      <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        Kort og Lang
      </h1>

      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Dine aktive spill
      </h2>
      <ActiveGames />

      <Separator className="my-2" />
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Dine siste spill
      </h2>
      <div className="space-y-4">
        <PlayedGames />
        {finishedGames.length > 0 ? (
          <a
            href="/game/finished-games"
            className="inline-flex h-8 items-center justify-center rounded-2xl bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Se alle dine spilte spill
          </a>
        ) : null}
      </div>
      <span className="sr-only">{activeGames.length} aktive spill</span>
    </main>
  )
}
