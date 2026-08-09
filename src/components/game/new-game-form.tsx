import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { useNavigate } from "@tanstack/react-router"

import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import { Combobox, type ComboboxOption } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from "@/components/ui/field"
import { Header } from "@/components/ui/header"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useSuspenseQuery } from "@tanstack/react-query"
import { locationsQuery, usersQuery } from "@/components/game/new-game-queries"

const gameSchema = z.object({
  players: z
    .array(z.string())
    .min(1, "Må være minst 2 – legg til en spiller til"),
  location: z.string().min(1, "Vennligst velg hvor spillet foregår"),
  gameType: z.enum(["7 runder", "9 runder"]),
  gameMaster: z.boolean(),
})

type NewGameValues = z.infer<typeof gameSchema>

export function NewGameForm() {
  const { data: locations } = useSuspenseQuery(locationsQuery)
  const { data: users } = useSuspenseQuery(usersQuery)
  const createGame = useMutation(api.games.createGame)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<NewGameValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      players: [],
      location: "",
      gameType: "7 runder",
      gameMaster: false,
    },
  })

  const locationOptions: ComboboxOption[] = locations.map((location) => ({
    value: location._id,
    label: location.name,
  }))
  const playerOptions: ComboboxOption[] = users.map((user) => ({
    value: user._id,
    label: user.name,
  }))

  const selectedPlayers = users.filter((user) =>
    form.watch("players").includes(user._id)
  )

  async function onSubmit(values: NewGameValues) {
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await createGame({
        players: values.players as Id<"users">[],
        location: values.location as Id<"locations">,
        gameType: values.gameType,
        gameMaster: values.gameMaster,
      })
      await navigate({
        to: "/game/active-game/$slug",
        params: { slug: result.gameId },
      })
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Noe gikk galt ved opprettelse av spillet"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <Header>Start et nytt spill</Header>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Controller
          control={form.control}
          name="location"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="location">Velg lokasjon</FieldLabel>
              <Combobox
                options={locationOptions}
                value={field.value}
                onChangeAction={(value) => field.onChange(value)}
                placeholder="Velg en lokasjon …"
                emptyText="Ingen lokasjoner funnet."
                searchPlaceholder="Søk etter lokasjon …"
              />
              <FieldDescription>Velg hvor spillet skal foregå</FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <FieldSeparator />

        <Controller
          control={form.control}
          name="gameType"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Velg antall runder</FieldLabel>
              <RadioGroup
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                className="grid-cols-2"
              >
                <FieldLabel className="cursor-pointer">
                  <RadioGroupItem value="7 runder" />
                  <FieldContent>
                    <FieldTitle>7 runder</FieldTitle>
                    <FieldDescription>Boks og Rems</FieldDescription>
                  </FieldContent>
                </FieldLabel>
                <FieldLabel className="cursor-pointer">
                  <RadioGroupItem value="9 runder" />
                  <FieldContent>
                    <FieldTitle>9 runder</FieldTitle>
                    <FieldDescription>Kort og Lang</FieldDescription>
                  </FieldContent>
                </FieldLabel>
              </RadioGroup>
              <FieldDescription>
                Velg antall runder som skal spilles.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <FieldSeparator />

        <Controller
          control={form.control}
          name="players"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="players">Legg til spillere</FieldLabel>
              <Combobox
                options={playerOptions}
                value={field.value}
                onChangeAction={(value) => field.onChange(value)}
                placeholder="Velg spillere …"
                displayText={
                  field.value.length > 0
                    ? `${field.value.length} spiller${field.value.length === 1 ? "" : "e"} valgt`
                    : undefined
                }
                emptyText="Ingen spillere funnet."
                searchPlaceholder="Søk etter spillere …"
                multiple
              />
              <FieldDescription>
                Velg spillere for å legge dem til i spillet
              </FieldDescription>
              {selectedPlayers.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-tight">
                    Valgte spillere:
                  </h3>
                  <div className="flex flex-col gap-2">
                    {selectedPlayers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between border-b py-2"
                      >
                        <span>{user.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Fjern ${user.name}`}
                          onClick={() =>
                            field.onChange(
                              field.value.filter((id) => id !== user._id)
                            )
                          }
                        >
                          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="gameMaster"
          render={({ field }) => (
            <Field
              orientation="horizontal"
              className="rounded-2xl border p-3 shadow-sm"
            >
              <FieldContent>
                <FieldLabel>Spillmester</FieldLabel>
                <FieldDescription>
                  Huk av dersom den som oppretter spillet skal skrive inn alle
                  poengene.
                </FieldDescription>
              </FieldContent>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="bg-sky-600">
        {isSubmitting ? "Oppretter spill …" : "Start spillet"}
      </Button>
    </form>
  )
}
