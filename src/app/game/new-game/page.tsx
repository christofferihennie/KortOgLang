"use client";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodv4Resolver } from "@/lib/zodv4Resolver";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import InvitePlayers from "./invitePlayers";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import SelectLocation from "./selectLocation";
import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const gameSchema = z.object({
  players: z
    .array(z.string())
    .min(1, "Må være minst 2, legg til en til spiller"),
  location: z.string("Venligst velg hvor spillet foregår"),
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
    },
  });

  const onSubmit = async (values: z.infer<typeof gameSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate that we have both players and location
      if (!values.players || values.players.length === 0) {
        throw new Error("Du må velge minst én spiller");
      }

      if (!values.location) {
        throw new Error("Du må velge en lokasjon");
      }

      await createEvent({
        players: values.players as Id<"users">[],
        location: values.location as Id<"locations">,
      });

      // Success! Redirect to games list or show success message
      router.push("/");
    } catch (err) {
      console.error("Error creating game:", err);
      setError(err instanceof Error ? err.message : "Noe gikk galt ved opprettelse av spillet");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Authenticated>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legg til spillere</FormLabel>
                  <InvitePlayers {...field} />
                  <FormDescription>
                    Velg spillere for å legge de til i spillet
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Velg lokasjon</FormLabel>
                  <SelectLocation {...field} />
                  <FormDescription>
                    Velg hvor spillet skal foregå
                  </FormDescription>
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
