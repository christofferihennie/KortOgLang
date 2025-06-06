"use client";

import { api } from "#/_generated/api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function ActiveGames() {
  const activeGames = useQuery(api.games.getActiveGames);

  return activeGames !== undefined ? (
    <div className="max-w-full my-2">
      <div className="flex gap-2 overflow-y-scroll py-4 pl-2">
        {activeGames.map((game) => (
          <ActiveGame
            key={game._id}
            id={game._id}
            creationTime={new Date(game._creationTime)}
            participants={game.participants}
            location={game.location?.name || "Ukjent"}
          />
        ))}
      </div>
    </div>
  ) : (
    <p className="min-h-52 leading-7 [&:not(:first-child)]:mt-6">
      Ingen aktive spill trykk på plusstegn for å opprette et nytt spill
    </p>
  );
}

interface ActiveGameProps {
  creationTime: Date;
  id: string;
  participants: { id: string; name: string }[];
  location: string;
}

function ActiveGame({
  creationTime,
  id,
  participants,
  location,
}: ActiveGameProps) {
  const isOlderThan24Hours = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return creationTime < twentyFourHoursAgo;
  };

  return (
    <Link href={`/game/active-game/${id}`}>
      <Card className="min-w-80 h-full">
        <CardHeader>
          <CardTitle>{location}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {creationTime.toLocaleString("no-NO", {
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </CardHeader>
        <CardContent className="h-full">
          <div className="flex gap-2 flex-wrap">
            {participants.map((participant) => {
              const nameParts = participant.name.split(" ");
              const formattedName = `${nameParts[0]} ${nameParts[1][0]}`;
              return <div key={participant.id}>{formattedName}</div>;
            })}
          </div>
        </CardContent>
        <CardFooter>
          {isOlderThan24Hours() ? (
            <Badge variant={"outline"} className="bg-amber-300">
              Stagnert
            </Badge>
          ) : (
            <Badge variant={"default"} className="bg-green-400">
              Aktiv
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
