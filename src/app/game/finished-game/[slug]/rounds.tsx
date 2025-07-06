"use client";

import { api } from "#/_generated/api";
import { userColors } from "%/constants/colors";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Preloaded, usePreloadedQuery, useQuery } from "convex/react";

export default function RoundStats(props: {
  preloadedRounds: Preloaded<typeof api.rounds.getRounds>;
}) {
  const rounds = usePreloadedQuery(props.preloadedRounds);
  const roundScores = useQuery(api.rounds.getParticipantsForRounds, {
    gameId: rounds[0].gameId,
  });

  if (!rounds || rounds.length === 0) {
    return <div>No rounds available</div>;
  }

  const defaultValue = rounds[0]?.roundNumber?.toString() || "1";

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {rounds.map((round) => (
          <TabsTrigger
            key={round.roundNumber}
            value={round.roundNumber.toString()}
          >
            {round.roundNumber}
          </TabsTrigger>
        ))}
      </TabsList>
      {roundScores?.map((round) => (
        <TabsContent key={round.roundId} value={round.roundNumber.toString()}>
          <h4 className="scroll-m-20 leading-7 font-semibold tracking-tight">
            {round.roundName}:
          </h4>
          <Table key={round.roundId}>
            <TableHeader>
              <TableRow>
                <TableHead>Spiller</TableHead>
                <TableHead>Poeng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {round.scores.map((participant) => (
                <TableRow key={participant._id}>
                  <TableCell>
                    <div
                      className={`${userColors[(participant.userInfo?.gameColor as keyof typeof userColors) || "slate"]} rounded-md py-4 px-2 w-full`}
                    >
                      {participant.userInfo?.name || "Ukjent"}
                    </div>
                  </TableCell>
                  <TableCell className="w-full">{participant.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      ))}
    </Tabs>
  );
}
