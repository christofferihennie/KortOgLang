import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"

export function Podium({ gameId }: { gameId: Id<"games"> }) {
  const { data: standings } = useQuery(
    convexQuery(api.games.activeGame.getStandings, { gameId })
  )

  const uniqueScores = Array.from(
    new Set((standings ?? []).map((player) => player.totalScore))
  )

  const firstPlace = (standings ?? []).filter(
    (player) => player.totalScore === uniqueScores[0]
  )
  const secondPlace = (standings ?? []).filter(
    (player) => player.totalScore === uniqueScores[1]
  )
  const thirdPlace = (standings ?? []).filter(
    (player) => player.totalScore === uniqueScores[2]
  )

  return (
    <div className="flex flex-col items-center">
      <div className="my-2 grid w-3/4 grid-cols-3 items-end gap-2">
        <div className="flex flex-col items-center gap-1">
          <div className="flex min-h-5 flex-col items-center text-center">
            {secondPlace.map((player, index) => (
              <p key={player.id || `second-${index}`} className="text-sm">
                {player.name.split(" ")[0] || "Ukjent"}
              </p>
            ))}
          </div>
          <div className="h-20 w-10 rounded-t-md rounded-b-sm bg-slate-400 py-1 text-center text-primary-foreground">
            <p className="text-xl">2.</p>
            <p className="text-sm">{secondPlace[0]?.totalScore || "0"}p</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex min-h-5 flex-col items-center text-center">
            {firstPlace.map((player, index) => (
              <p
                key={player.id || `first-${index}`}
                className="text-sm font-semibold"
              >
                {player.name.split(" ")[0] || "Ukjent"}
              </p>
            ))}
          </div>
          <div className="h-28 w-12 rounded-t-md rounded-b-sm bg-amber-300 py-1 text-center text-primary-foreground">
            <p className="text-xl">1.</p>
            <p className="text-sm">{firstPlace[0]?.totalScore || "0"}p</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex min-h-5 flex-col items-center text-center">
            {thirdPlace.map((player, index) => (
              <p key={player.id || `third-${index}`} className="text-sm">
                {player.name.split(" ")[0] || "Ukjent"}
              </p>
            ))}
          </div>
          <div className="h-14 w-10 rounded-t-md rounded-b-sm bg-yellow-900 py-0.5 text-center text-neutral-100">
            <p className="text-xl">3.</p>
            <p className="text-sm">{thirdPlace[0]?.totalScore || "0"}p</p>
          </div>
        </div>
      </div>
    </div>
  )
}
