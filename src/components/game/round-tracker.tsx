import { useMutation } from "convex/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useSuspenseQuery } from "@tanstack/react-query"

import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import { activeGameQueries } from "@/components/game/active-game-queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export function RoundTracker({ gameId }: { gameId: Id<"games"> }) {
  const queries = activeGameQueries(gameId)
  const { data: game } = useSuspenseQuery(queries.game)
  const { data: rounds } = useSuspenseQuery(queries.rounds)
  const { data: roundScores } = useSuspenseQuery(queries.roundScores)
  const { data: user } = useSuspenseQuery(queries.user)
  const updateScore = useMutation(api.rounds.updateScore)
  const [round, setRound] = useState("1")
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const values: Record<string, string> = {}
    for (const currentRound of roundScores) {
      for (const participant of currentRound.scores) {
        values[participant._id] = String(participant.score)
      }
    }
    setInputValues(values)
  }, [roundScores])

  const availableRound = rounds.some(
    (currentRound) => currentRound.roundNumber.toString() === round
  )
  const currentRound = availableRound
    ? round
    : (rounds[0]?.roundNumber.toString() ?? "1")

  if (rounds.length === 0) {
    return <p className="text-muted-foreground">Ingen runder tilgjengelig.</p>
  }

  const nextRound = () => {
    const next = (Number.parseInt(currentRound, 10) % rounds.length) + 1
    setRound(String(next))
  }

  return (
    <Tabs
      value={currentRound}
      onValueChange={(value) => setRound(String(value))}
    >
      <div className="flex items-center justify-between gap-2">
        <TabsList className="max-w-full overflow-x-auto">
          {rounds.map((current) => (
            <TabsTrigger
              key={current.roundNumber}
              value={current.roundNumber.toString()}
            >
              {current.roundNumber}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button type="button" onClick={nextRound} className="shrink-0">
          Neste runde
        </Button>
      </div>

      {rounds.map((current) => {
        const scoreRound = roundScores.find(
          (candidate) => candidate.roundNumber === current.roundNumber
        )
        if (!scoreRound) return null

        return (
          <TabsContent
            key={current.roundNumber}
            value={current.roundNumber.toString()}
          >
            <h2 className="leading-7 font-semibold tracking-tight">
              {current.roundName}{" "}
              {game?.type === "9 runder" ? `(${current.roundNumber + 6})` : ""}:
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
                  const colorKey =
                    (participant.userInfo
                      ?.gameColor as keyof typeof userColors) ?? "slate"
                  const editable = game?.gameMaster
                    ? participant.gameMaster !== true
                    : participant.userId === user?._id

                  return (
                    <TableRow key={participant._id}>
                      <TableCell>
                        <div
                          className={`${userColors[colorKey] ?? userColors.slate} w-full rounded-md px-2 py-4`}
                        >
                          {participant.userInfo?.name ?? "Ukjent"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          inputMode="numeric"
                          type="number"
                          min={0}
                          value={inputValues[participant._id] ?? ""}
                          disabled={!editable}
                          onChange={(event) => {
                            const value = event.target.value
                            setInputValues((previous) => ({
                              ...previous,
                              [participant._id]: value,
                            }))
                            if (value === "") return

                            const numericValue = Number.parseInt(value, 10)
                            if (Number.isNaN(numericValue) || numericValue < 0)
                              return

                            updateScore({
                              roundScoreId: participant._id,
                              score: numericValue,
                            }).catch((error: unknown) => {
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "Kunne ikke oppdatere poengsummen"
                              )
                            })
                          }}
                        />
                      </TableCell>
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
