"use client";

import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function FinishGame({ gameId }: { gameId: Id<"games"> }) {
  const finishGameMutation = useMutation(api.games.finishGame);
  const router = useRouter();

  const finishGame = () => {
    finishGameMutation({ gameId })
      .then(() => router.push("/"))
      .catch((e) => toast(`Det oppstod en feil: ${e.message}`));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-fit">
          Avslutt spillet
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
          <AlertDialogDescription>
            Denne handlingen kan ikke angres. Dette vil permanent avslutte
            spillet og fjerdig gjøre resultatet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Fortsett spillet</AlertDialogCancel>
          <AlertDialogAction onClick={finishGame}>
            Avslutt spillet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
