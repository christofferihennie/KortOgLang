import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"

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

export function PlayedGames({ limit = 10 }: { limit?: number }) {
  const query = limit === 10 ? recentFinishedGamesQuery : allFinishedGamesQuery
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
            <TableRow
              key={game._id}
              className="cursor-pointer"
              tabIndex={0}
              role="link"
              onClick={() => {
                window.location.href = `/game/finished-game/${game._id}`
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  window.location.href = `/game/finished-game/${game._id}`
                }
              }}
            >
              <TableCell>
                {humanReadableDate(new Date(game._creationTime))}
              </TableCell>
              <TableCell>
                {game.participation.finalPosition ?? "0"}. med{" "}
                {game.participation.finalScore ?? "-"} poeng
              </TableCell>
              <TableCell>{game.winner_name}</TableCell>
              <TableCell>{game.num_participants}</TableCell>
              <TableCell>{game.location?.name ?? "Ukjent"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
