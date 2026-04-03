import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { useConvexMutation } from "@convex-dev/react-query"
import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form-start"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { toast } from "sonner"
import z from "zod"
import { GameMaster } from "./game-master"
import { SelectPlayers } from "./select-players"
import { SetLocation } from "./set-location"

const newGameSchema = z.object({
  players: z.array(z.string()).min(2, "Må være minst to spillere"),
  location: z.string().min(1, "Vennligst velg et sted"),
  gameMaster: z.boolean(),
})

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    SetLocation,
    GameMaster,
    SelectPlayers,
  },
  formComponents: {},
})

export function NewGameForm({
  locations,
  players,
}: {
  locations: { label: string; value: string }[]
  players?: { label: string; value: string }[]
}) {
  const navigate = useNavigate()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useConvexMutation(api.games.createGame.createGame),
  })

  const form = useAppForm({
    defaultValues: {
      players: [] as Array<string>,
      location: "",
      gameMaster: false,
    },
    validators: {
      onSubmit: newGameSchema,
    },
    onSubmit: async (v) => {
      const { gameMaster, location, players: participatns } = v.value

      try {
        const gameId = await mutateAsync({
          location: location as Id<"locations">,
          players: participatns as Array<Id<"users">>,
          gameMaster,
        })

        await navigate({
          to: "/games/game/$gameId",
          params: { gameId },
        })
      } catch (e) {
        console.log(e)

        toast.error("Oi! Det oppsto en feil!", {
          description: "Skulle feilen vedvare si ifra til Christoffer",
        })
      }
    },
  })

  return (
    <form
      id="new-game-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4 py-4"
    >
      <FieldGroup className="space-y-4">
        <form.AppField
          name="location"
          children={(field) => (
            <field.SetLocation
              label="Lokasjon"
              description="Velg hvor spillet skal ta sted"
              items={locations}
            />
          )}
        />
        <form.AppField
          name="gameMaster"
          children={(field) => (
            <field.GameMaster
              label="Spill mester"
              description="Huk av dersom man ønsker at den som oppretter spillet skriver inn alle
          sine poeng."
            />
          )}
        />
        <form.AppField
          name="players"
          children={(field) => (
            <field.SelectPlayers
              label="Velg spillere"
              description="Velg alle som skal være med å spille"
              items={players}
            />
          )}
        />
      </FieldGroup>
      <Button type="submit" form="new-game-form" disabled={isPending}>
        La oss starte!
      </Button>
    </form>
  )
}
