"use client"

import { api } from "#/_generated/api";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useMemo } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PointsChart({ preloadedRoundScores }: { preloadedRoundScores: Preloaded<typeof api.rounds.getParticipantsForRounds>; }) {

	const roundScores = usePreloadedQuery(preloadedRoundScores);

	// Build chart config keyed by player with label and color
	const chartConfig = useMemo<ChartConfig>(() => {
		if (!roundScores || roundScores.length === 0) return {};

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
		};

		// Capture a stable mapping of userId to display name and color key
		const players = new Map<string, { name: string; colorKey: string }>();
		for (const r of roundScores) {
			for (const s of r.scores) {
				if (!players.has(s.userId)) {
					players.set(s.userId, {
						name: s.userInfo?.name ?? s.userId,
						colorKey: (s.userInfo?.gameColor as string) || "slate",
					});
				}
			}
		}

		const config: ChartConfig = {};
		for (const [userId, { name, colorKey }] of players) {
			const color = colorMap[colorKey] ?? colorMap["slate"];
			config[userId] = { label: name, color };
		}

		return config;
	}, [roundScores]);

	// Build cumulative per-player scores per round for charting
	const chartData = useMemo(() => {
		if (!roundScores || roundScores.length === 0) return [];

		// Sort rounds by roundNumber to ensure chronological order
		const sorted = [...roundScores].sort((a, b) => a.roundNumber - b.roundNumber);

		// Collect unique players across all rounds
		const players = new Map<string, string>(); // userId -> displayName
		for (const r of sorted) {
			for (const s of r.scores) {
				const displayName = s.userInfo?.name ?? s.userId;
				if (!players.has(s.userId)) {
					players.set(s.userId, displayName);
				}
			}
		}

		// Initialize cumulative scores
		const cumulative = new Map<string, number>();
		for (const userId of players.keys()) {
			cumulative.set(userId, 0);
		}

		// Build chart points
		const points: Array<Record<string, number | string>> = [];

		for (const r of sorted) {
			// Update cumulative with this round's scores
			for (const s of r.scores) {
				cumulative.set(s.userId, (cumulative.get(s.userId) ?? 0) + (s.score ?? 0));
			}

			// Create an entry for this round
			const entry: Record<string, number | string> = {
				round: r.roundNumber,
			};

			for (const [userId] of players) {
				entry[userId] = cumulative.get(userId) ?? 0;
			}

			points.push(entry);
		}

		return points;
	}, [roundScores]);

	return (
		<div>
			<ChartContainer config={chartConfig}>
				<LineChart
					accessibilityLayer
					data={chartData}
					margin={{
						left: 6,
						right: 12,
					}}
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="round"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
					/>
					<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
					{Object.keys(chartConfig).map((key) => (
						<Line
							key={key}
							dataKey={key}
							type="linear"
							stroke={`var(--color-${key})`}
							strokeWidth={2}
							dot={{
								fill: `var(--color-${key})`,
							}}
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
							{Object.entries(chartConfig).map(([userId, cfg]) => (
								<TableHead key={userId} className="">{cfg.label as string}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{chartData.map((row) => (
							<TableRow key={row.round as number}>
								<TableCell>{row.round}</TableCell>
								{Object.keys(chartConfig).map((userId) => (
									<TableCell key={userId}>
										{(row[userId] as number) ?? 0}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
