import { convexQuery } from "@convex-dev/react-query"
import { Link } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/loading-spinner"
import { formatParticipantName } from "@/lib/game-helpers"
import { api } from "../../convex/_generated/api"

export const activeGamesQuery = convexQuery(api.games.getActiveGames, {})

const gameDateFormat = new Intl.DateTimeFormat("nb-NO", {
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

export function ActiveGames() {
  const { data: activeGames } = useSuspenseQuery(activeGamesQuery)

  if (activeGames.length === 0) {
    return (
      <p className="min-h-52 leading-7 text-primary [&:not(:first-child)]:mt-6">
        Ingen aktive spill – trykk på plusstegnet nederst for å opprette et nytt
        spill.
      </p>
    )
  }

  return (
    <div className="my-2 max-w-full">
      <div className="flex gap-2 overflow-x-auto py-4 pl-2">
        {activeGames.map((game) => (
          <ActiveGame
            key={game._id}
            id={game._id}
            creationTime={new Date(game._creationTime)}
            participants={game.participants}
            location={game.location?.name ?? "Ukjent"}
          />
        ))}
      </div>
    </div>
  )
}

interface ActiveGameProps {
  creationTime: Date
  id: string
  participants: { id: string; name: string }[]
  location: string
}

function ActiveGame({
  creationTime,
  id,
  participants,
  location,
}: ActiveGameProps) {
  const isOlderThan24Hours =
    creationTime.getTime() < Date.now() - 24 * 60 * 60 * 1000

  return (
    <Link
      className="block min-w-80"
      to="/game/active-game/$slug"
      params={{ slug: id }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{location}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {gameDateFormat.format(creationTime)}
          </p>
        </CardHeader>
        <CardContent className="h-full">
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <div key={participant.id}>
                {formatParticipantName(participant.name)}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {isOlderThan24Hours ? (
            <Badge variant="outline" className="bg-amber-300">
              Stagnert
            </Badge>
          ) : (
            <Badge variant="default" className="bg-green-400">
              Aktiv
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

export function ActiveGamesLoading() {
  return <Spinner> Laster aktive spill …</Spinner>
}
