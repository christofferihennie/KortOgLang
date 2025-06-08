"use client";

import { api } from "#/_generated/api";
import { userColors } from "%/constants/colors";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import { useEffect, useState } from "react";

export default function RoundTracker(props: {
  preloadedRounds: Preloaded<typeof api.rounds.getRounds>;
}) {
  const rounds = usePreloadedQuery(props.preloadedRounds);
  const roundScores = useQuery(api.rounds.getParticipantsForRounds, {
    gameId: rounds[0].gameId,
  });
  const updateUserScore = useMutation(api.rounds.updateScore);
  const user = useQuery(api.users.getUser);

  // Local state to manage input values
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  // Sync server data to local state when it changes
  useEffect(() => {
    if (roundScores) {
      const newInputValues: Record<string, string> = {};
      for (const round of roundScores) {
        for (const participant of round.scores) {
          newInputValues[participant._id] = participant.score.toString();
        }
      }
      setInputValues(newInputValues);
    }
  }, [roundScores]);

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
                  <TableCell>
                    <Input
                      inputMode="numeric"
                      type="number"
                      value={inputValues[participant._id] || ""}
                      disabled={participant.userId !== user?._id}
                      min={0}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Update local state immediately
                        setInputValues((prev) => ({
                          ...prev,
                          [participant._id]: value,
                        }));

                        // Allow empty input (user is clearing the field)
                        if (value === "") {
                          return;
                        }

                        const numericValue = Number.parseInt(value);

                        // Only update server if it's a valid number and >= 0
                        if (!Number.isNaN(numericValue) && numericValue >= 0) {
                          updateUserScore({
                            roundScoreId: participant._id,
                            score: numericValue,
                          });
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      ))}
    </Tabs>
  );
}
