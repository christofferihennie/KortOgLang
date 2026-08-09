import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { humanReadableDate } from "@/lib/utils"
import { api } from "../../convex/_generated/api"

export const recentFinishedGamesQuery = convexQuery(
  api.games.getFinishedGames,
  {
    n: 10,
  }
)

export const allFinishedGamesQuery = convexQuery(api.games.getFinishedGames, {})

export function PlayedGames({ limit }: { limit?: number }) {
  const query =
    limit === 10
      ? recentFinishedGamesQuery
      : limit === undefined
        ? allFinishedGamesQuery
        : convexQuery(api.games.getFinishedGames, { n: limit })
  const { data: finishedGames } = useSuspenseQuery(query)

  if (finishedGames.length === 0) {
    return (
      <p className="text-muted-foreground">Ingen ferdigspilte spill ennå.</p>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dato</TableHead>
            <TableHead>Ditt resultat</TableHead>
            <TableHead>Vinner</TableHead>
            <TableHead>Ant. spillere</TableHead>
            <TableHead>Sted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {finishedGames.map((game) => (
            <TableRow key={game._id}>
              <LinkedGameCell slug={game._id}>
                {humanReadableDate(new Date(game._creationTime))}
              </LinkedGameCell>
              <LinkedGameCell slug={game._id}>
                {game.participation.finalPosition ?? "0"}. med{" "}
                {game.participation.finalScore ?? "-"} poeng
              </LinkedGameCell>
              <LinkedGameCell slug={game._id}>
                {game.winner_name}
              </LinkedGameCell>
              <LinkedGameCell slug={game._id}>
                {game.num_participants}
              </LinkedGameCell>
              <LinkedGameCell slug={game._id}>
                {game.location?.name ?? "Ukjent"}
              </LinkedGameCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function LinkedGameCell({
  slug,
  children,
}: {
  slug: string
  children: ReactNode
}) {
  return (
    <TableCell className="p-0">
      <Link
        to="/game/finished-game/$slug"
        params={{ slug }}
        className="block p-2"
      >
        {children}
      </Link>
    </TableCell>
  )
}
