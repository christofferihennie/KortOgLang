"use client";

import { api } from "#/_generated/api";
import { useQuery } from "convex/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GameList() {
  const gameList = useQuery(api.games.getUserGames);

  return (
    <div>
      <h1>Game List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dato</TableHead>
            <TableHead>Sted</TableHead>
            <TableHead>Vinner</TableHead>
            <TableHead>Antall spillere</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gameList?.map((game) => (
            <TableRow key={game._id}>
              <TableCell>
                {new Date(game._creationTime).toLocaleString("no-NO", {
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>{game.location?.name}</TableCell>
              <TableCell>{game.winner_name}</TableCell>
              <TableCell>{game.num_participants}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
