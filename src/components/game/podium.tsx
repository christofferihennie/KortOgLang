import { useSuspenseQuery } from "@tanstack/react-query"

import type { Id } from "../../../convex/_generated/dataModel"
import { activeGameQueries } from "@/components/game/active-game-queries"
import { rankByLowestScore } from "@/lib/game-helpers"

export function Podium({ gameId }: { gameId: Id<"games"> }) {
  const { data: standing } = useSuspenseQuery(
    activeGameQueries(gameId).standing
  )

  if (standing.length === 0) {
    return (
      <p className="py-6 text-center text-muted-foreground">
        Ingen poeng registrert ennå.
      </p>
    )
  }

  const playersWithPositions = standing.map((player) => {
    const position = rankByLowestScore(
      player.totalScore,
      standing.map((candidate) => candidate.totalScore)
    )
    return { ...player, position }
  })

  const firstPlace = playersWithPositions.filter(
    (player) => player.position === 1
  )
  const secondPlace = playersWithPositions.filter(
    (player) => player.position === 2
  )
  const thirdPlace = playersWithPositions.filter(
    (player) => player.position === 3
  )

  return (
    <div className="flex flex-col items-center">
      <div className="my-6 grid w-3/4 grid-cols-3 items-end gap-2">
        <PodiumPlace
          players={secondPlace}
          position={2}
          className="h-20 w-10 bg-slate-400"
        />
        <PodiumPlace
          players={firstPlace}
          position={1}
          className="h-28 w-12 bg-amber-300"
          emphasize
        />
        <PodiumPlace
          players={thirdPlace}
          position={3}
          className="h-14 w-10 bg-yellow-900"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {playersWithPositions
          .filter((player) => player.position > 3)
          .map((player) => (
            <p
              key={`${player.userId}-${player.position}`}
              className="leading-7"
            >
              {player.position}. {shortName(player.user?.name)} –{" "}
              {player.totalScore} poeng
            </p>
          ))}
      </div>
    </div>
  )
}

function PodiumPlace({
  players,
  position,
  className,
  emphasize = false,
}: {
  players: Array<{ user?: { name: string } | null; totalScore: number }>
  position: number
  className: string
  emphasize?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex min-h-5 flex-col items-center text-center">
        {players.map((player, index) => (
          <p
            key={`${player.user?.name ?? "unknown"}-${index}`}
            className={emphasize ? "text-sm font-semibold" : "text-sm"}
          >
            {shortName(player.user?.name)}
          </p>
        ))}
      </div>
      <div
        className={`${className} rounded-t-md rounded-b-sm py-1 text-center text-primary-foreground`}
      >
        <p className="text-xl">{position}.</p>
        <p className="text-sm">{players.at(0)?.totalScore ?? 0}p</p>
      </div>
    </div>
  )
}

function shortName(name?: string) {
  return name?.trim().split(/\s+/)[0] ?? "Ukjent"
}
