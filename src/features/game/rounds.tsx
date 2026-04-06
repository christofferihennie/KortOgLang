import { QuaternaryHeader } from "@/components/common/text"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayerScoreInput } from "@/features/game/player-score-input"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useState } from "react"
import { USER_COLORS } from "shared/colors"
import { GAME_TYPES, GAME_TYPE_MAPPING } from "shared/game"

export function Rounds({
  players,
  gameMaster,
  type,
  rounds,
}: {
  players: Array<{ id: Id<"users">; name: string; color: string }>
  gameMaster?: Id<"users">
  type: (typeof GAME_TYPES)[number]
  rounds: Array<Doc<"rounds">>
}) {
  let [currentRound, setCurrentRound] = useState<number>(1)
  const roundNamings = GAME_TYPE_MAPPING[type]
  const defaultRoundId = rounds[0]?._id

  return (
    <Tabs defaultValue={defaultRoundId} value={currentRound}>
      <QuaternaryHeader>Runde:</QuaternaryHeader>
      <div className="flex justify-between gap-2 overflow-y-scroll">
        <TabsList>
          {rounds.map((round) => (
            <TabsTrigger
              key={round._id}
              value={round.roundNumber}
              onClick={() => setCurrentRound(round.roundNumber)}
            >
              {round.roundNumber + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          onClick={() =>
            setCurrentRound((currentRound + 1) % Math.max(rounds.length, 1))
          }
        >
          Neste Runde
        </Button>
      </div>
      {rounds.map((round) => (
        <TabsContent key={round._id} value={round.roundNumber}>
          <QuaternaryHeader>{roundNamings[round.roundNumber]}</QuaternaryHeader>
          <Round
            roundId={round._id}
            players={players}
            gameMaster={gameMaster}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export function Round({
  roundId,
  players,
  gameMaster,
}: {
  roundId: Id<"rounds">
  players: Array<{ id: Id<"users">; name: string; color: string }>
  gameMaster?: Id<"users">
}) {
  const { data: currentPlayer } = useQuery(
    convexQuery(api.auth.getCurrentPlayer)
  )

  const { data: roundScores } = useQuery(
    convexQuery(api.games.activeGame.getRoundScores, { roundId })
  )

  const isGameMaster = gameMaster === currentPlayer?._id

  return (
    <Table className="max-w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Spillere</TableHead>
          <TableHead>Poeng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>
              <div
                className={cn(
                  USER_COLORS[player.color as keyof typeof USER_COLORS],
                  "w-full rounded-3xl px-4 py-2 text-center"
                )}
              >
                {player.name}
              </div>
            </TableCell>
            <TableCell>
              <PlayerScoreInput
                disabled={!isGameMaster && player.id !== currentPlayer?._id}
                playerId={player.id}
                roundId={roundId}
                score={roundScores && roundScores[player.id]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
