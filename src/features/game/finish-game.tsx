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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"

export function FinishGame({ gameId }: { gameId: Id<"games"> }) {
  const navigate = useNavigate()
  const { mutate: finish, isPending } = useMutation({
    mutationFn: useConvexMutation(api.games.activeGame.finishGame),
    onSuccess: () => {
      navigate({
        to: "/",
      })
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" disabled={isPending}>
            Avslutt Spillet
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Er du helt sikker?</AlertDialogTitle>
          <AlertDialogDescription>
            Hvis du avslutter spillet så stopper det for alle, og en vinner blir
            kåret.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Gå tilbake</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => finish({ gameId })}
            disabled={isPending}
          >
            Ja, jeg er sikker
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
