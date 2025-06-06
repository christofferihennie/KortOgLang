"use client";

import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodv4Resolver } from "@/lib/zodv4Resolver";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import InvitePlayers from "./invitePlayers";
import SelectLocation from "./selectLocation";

const gameSchema = z.object({
  players: z
    .array(z.string())
    .min(1, "Må være minst 2, legg til en til spiller"),
  location: z.string("Venligst velg hvor spillet foregår"),
  rounds: z
    .number("Antall runder må være et tall")
    .min(1, "Må være minst 1 runde")
    .max(7, "Kan være maks 7 runder"),
});

export default function NewGame() {
  const createEvent = useMutation(api.games.createGame);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof gameSchema>>({
    resolver: zodv4Resolver(gameSchema),
    defaultValues: {
      players: [],
      location: "",
      rounds: 7,
    },
  });

  const onSubmit = async (values: z.infer<typeof gameSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!values.players || values.players.length === 0) {
        throw new Error("Du må velge minst én spiller");
      }

      if (!values.location) {
        throw new Error("Du må velge en lokasjon");
      }

      const createdEvent = await createEvent({
        players: values.players as Id<"users">[],
        location: values.location as Id<"locations">,
        rounds: values.rounds,
      });

      router.push(`/game/active-game/${createdEvent.gameId}`);
    } catch (err) {
      console.error("Error creating game:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Noe gikk galt ved opprettelse av spillet",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Authenticated>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Start et nytt spill
            </h2>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Velg lokasjon</FormLabel>
                  <SelectLocation
                    value={field.value}
                    onChangeAction={field.onChange}
                  />
                  <FormDescription>
                    Velg hvor spillet skal foregå
                  </FormDescription>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="rounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Velg antall runder</FormLabel>
                  <Input {...field} type="number" />
                  <FormDescription>
                    Antall runder som skal spilles
                  </FormDescription>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legg til spillere</FormLabel>
                  <InvitePlayers
                    value={field.value}
                    onChangeAction={field.onChange}
                  />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oppretter spill...
                </>
              ) : (
                "Start spillet"
              )}
            </Button>
          </form>
        </Form>
      </Authenticated>
      <Unauthenticated>
        <p>Du må logge inn først</p>
      </Unauthenticated>
    </>
  );
}
