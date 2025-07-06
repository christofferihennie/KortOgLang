"use client";

import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { api } from "#/_generated/api";
import type { Id } from "#/_generated/dataModel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Header } from "@/components/ui/header";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { zodv4Resolver } from "@/lib/zodv4Resolver";
import InvitePlayers from "./invitePlayers";
import SelectLocation from "./selectLocation";

const gameSchema = z.object({
  players: z
    .array(z.string())
    .min(1, "Må være minst 2, legg til en til spiller"),
  location: z.string("Venligst velg hvor spillet foregår"),
  gameType: z.literal(["7 runder", "9 runder"]),
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
      gameType: "7 runder",
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
        gameType: values.gameType,
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
            <Header>Start et nytt spill</Header>

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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="gameType"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Velg antall runder</FormLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue="7 runder"
                    className="flex gap-4"
                  >
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Label
                          className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary/5 flex items-start gap-3 rounded-lg border p-3 cursor-pointer"
                          htmlFor="7-runder"
                        >
                          <RadioGroupItem
                            value="7 runder"
                            id="7-runder"
                            className="data-[state=checked]:border-primary"
                          />
                          <div className="grid gap-1 font-normal">
                            <div className="font-medium">7 runder</div>
                            <div className="text-muted-foreground pr-2 text-xs leading-snug text-balance">
                              Boks og Rems
                            </div>
                          </div>
                        </Label>
                      </div>
                    </FormControl>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Label
                          className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary/5 flex items-start gap-3 rounded-lg border p-3 cursor-pointer"
                          htmlFor="9-runder"
                        >
                          <RadioGroupItem
                            value="9 runder"
                            id="9-runder"
                            className="data-[state=checked]:border-primary"
                          />
                          <div className="grid gap-1 font-normal">
                            <div className="font-medium">9 runder</div>
                            <div className="text-muted-foreground pr-2 text-xs leading-snug text-balance">
                              Kort og Lang
                            </div>
                          </div>
                        </Label>
                      </div>
                    </FormControl>
                  </RadioGroup>
                  <FormDescription>
                    Velg antall runder som skal spilles.
                  </FormDescription>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky-600"
            >
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
