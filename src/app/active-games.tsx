"use client"

import { api } from "#/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";

export default function ActiveGames() {
  const activeGames = useQuery(api.games.getActiveGames);

 console.log(activeGames)

  return activeGames ? (
    <div className="max-w-full m-4">
    <div className="flex gap-4 overflow-y-scroll p-4">
      {activeGames.map((game) => (
        <ActiveGame key={game._id} creationTime={new Date(game._creationTime)} participants={game.participants} location={game.location?.name || "Ukjent"} />
      ))}
    </div>
    </div>
  ) : (
    <p>Ingen aktive spill trykk på plusstegn for å opprette et nytt spill</p>
  );
}

interface ActiveGameProps {
  creationTime: Date;
  participants: {id: string, name: string}[];
  location: string;
}

function ActiveGame({creationTime, participants, location}: ActiveGameProps) {
  const isOlderThan24Hours = () => {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      return creationTime < twentyFourHoursAgo;
    };

  return (
    <Card className="min-w-3xs">
      <CardHeader>
        <CardTitle>
          {location} {creationTime.toLocaleString("no-NO", {
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div>
          {participants.map((participant) => (
            <div key={participant.id}>{participant.name}</div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {isOlderThan24Hours() ? <Badge variant={"outline"} className="bg-amber-300">Stagnert</Badge> : <Badge variant={"default"} className="bg-green-400">Aktiv</Badge>}
      </CardFooter>
    </Card>
  )
}
