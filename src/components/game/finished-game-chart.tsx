import { useSuspenseQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import type { Id } from "../../../convex/_generated/dataModel"
import { activeGameQueries } from "@/components/game/active-game-queries"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const colorMap: Record<string, string> = {
  slate: "#94a3b8",
  red: "#f87171",
  orange: "#fb923c",
  emerald: "#34d399",
  yellow: "#facc15",
  green: "#4ade80",
  cyan: "#22d3ee",
  blue: "#60a5fa",
  purple: "#a78bfa",
  pink: "#f472b6",
}

export function FinishedGameChart({ gameId }: { gameId: Id<"games"> }) {
  const { data: roundScores } = useSuspenseQuery(
    activeGameQueries(gameId).roundScores
  )

  const players = useMemo(() => {
    const result = new Map<string, { name: string; colorKey: string }>()
    for (const round of roundScores) {
      for (const score of round.scores) {
        if (!score.userInfo) continue
        if (!result.has(score.userId)) {
          result.set(score.userId, {
            name: score.userInfo.name,
            colorKey: score.userInfo.gameColor ?? "slate",
          })
        }
      }
    }
    return result
  }, [roundScores])

  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {}
    for (const [userId, player] of players) {
      config[userId] = {
        label: player.name,
        color: colorMap[player.colorKey] ?? colorMap.slate,
      }
    }
    return config
  }, [players])

  const chartData = useMemo(() => {
    const sortedRounds = [...roundScores].sort(
      (left, right) => left.roundNumber - right.roundNumber
    )
    const totals = new Map<string, number>()
    for (const userId of players.keys()) totals.set(userId, 0)

    return sortedRounds.map((round) => {
      for (const score of round.scores) {
        totals.set(score.userId, (totals.get(score.userId) ?? 0) + score.score)
      }

      const point: Record<string, number> = { round: round.roundNumber }
      for (const userId of players.keys()) {
        point[userId] = totals.get(userId) ?? 0
      }
      return point
    })
  }, [players, roundScores])

  if (chartData.length === 0 || players.size === 0) {
    return <p className="text-muted-foreground">Ingen poeng tilgjengelig.</p>
  }

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 6, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="round"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          {Object.keys(chartConfig).map((userId) => (
            <Line
              key={userId}
              dataKey={userId}
              type="linear"
              stroke={`var(--color-${userId})`}
              strokeWidth={2}
              dot={{ fill: `var(--color-${userId})` }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-background text-white"
                fontSize={12}
              />
            </Line>
          ))}
        </LineChart>
      </ChartContainer>

      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Runde</TableHead>
              {Object.entries(chartConfig).map(([userId, config]) => (
                <TableHead key={userId}>{config.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {chartData.map((point) => (
              <TableRow key={point.round}>
                <TableCell>{point.round}</TableCell>
                {Object.keys(chartConfig).map((userId) => (
                  <TableCell key={userId}>{point[userId] ?? 0}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
