import { useMutation } from "convex/react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"

import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
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

export function FinishGameDialog({ gameId }: { gameId: Id<"games"> }) {
  const finishGame = useMutation(api.games.finishGame)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)

  async function handleFinish() {
    setIsFinishing(true)
    try {
      await finishGame({ gameId })
      setOpen(false)
      await navigate({ to: "/" })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Det oppstod en feil"
      )
    } finally {
      setIsFinishing(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" className="mb-6 w-fit" type="button" />
        }
      >
        Avslutt spillet
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
          <AlertDialogDescription>
            Denne handlingen kan ikke angres. Dette vil permanent avslutte
            spillet og ferdigstille resultatet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isFinishing}>
            Fortsett spillet
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            disabled={isFinishing}
            onClick={handleFinish}
          >
            {isFinishing ? "Avslutter …" : "Avslutt spillet"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
