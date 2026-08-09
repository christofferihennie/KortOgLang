import { useSuspenseQuery } from "@tanstack/react-query"
import { useState } from "react"

import type { Id } from "../../../convex/_generated/dataModel"
import { activeGameQueries } from "@/components/game/active-game-queries"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userColors } from "../../../shared/constants/colors"

export function FinishedRoundStats({ gameId }: { gameId: Id<"games"> }) {
  const queries = activeGameQueries(gameId)
  const { data: rounds } = useSuspenseQuery(queries.rounds)
  const { data: roundScores } = useSuspenseQuery(queries.roundScores)
  const [selectedRound, setSelectedRound] = useState<string>()

  if (rounds.length === 0) {
    return <p className="text-muted-foreground">Ingen runder tilgjengelig.</p>
  }

  const value = selectedRound ?? rounds.at(0)?.roundNumber.toString() ?? "1"

  return (
    <Tabs
      value={value}
      onValueChange={(next) => setSelectedRound(String(next))}
    >
      <TabsList className="max-w-full overflow-x-auto">
        {rounds.map((round) => (
          <TabsTrigger
            key={round.roundNumber}
            value={round.roundNumber.toString()}
          >
            {round.roundNumber}
          </TabsTrigger>
        ))}
      </TabsList>
      {rounds.map((round) => {
        const scoreRound = roundScores.find(
          (candidate) => candidate.roundNumber === round.roundNumber
        )
        if (!scoreRound) return null

        return (
          <TabsContent
            key={round.roundNumber}
            value={round.roundNumber.toString()}
          >
            <h2 className="leading-7 font-semibold tracking-tight">
              {round.roundName}:
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Spiller</TableHead>
                  <TableHead>Poeng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scoreRound.scores.map((participant) => {
                  if (!participant.userInfo) return null
                  const colorKey = participant.userInfo.gameColor
                  const colorClass =
                    colorKey && colorKey in userColors
                      ? userColors[colorKey as keyof typeof userColors]
                      : userColors.slate

                  return (
                    <TableRow key={participant._id}>
                      <TableCell>
                        <div
                          className={`${colorClass} w-full rounded-md px-2 py-4`}
                        >
                          {participant.userInfo.name}
                        </div>
                      </TableCell>
                      <TableCell>{participant.score}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
