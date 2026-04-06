import { Input } from "@/components/ui/input"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useEffect, useState } from "react"

export function PlayerScoreInput({
  disabled,
  playerId,
  roundId,
  score,
}: {
  disabled: boolean
  playerId: Id<"users">
  roundId: Id<"rounds">
  score?: number
}) {
  const { mutate: upsertScore } = useMutation({
    mutationFn: useConvexMutation(api.games.activeGame.upsertScore),
  })
  const [draftScore, setDraftScore] = useState(score?.toString() ?? "")

  useEffect(() => {
    setDraftScore(score?.toString() ?? "")
  }, [score])

  const commitScore = () => {
    if (draftScore === "") {
      setDraftScore(score?.toString() ?? "")
      return
    }

    const nextScore = Number(draftScore)

    if (Number.isNaN(nextScore) || nextScore === score) {
      setDraftScore(score?.toString() ?? "")
      return
    }

    upsertScore({
      playerId,
      roundId,
      score: nextScore,
    })
  }

  return (
    <Input
      disabled={disabled}
      placeholder="0"
      value={draftScore}
      type="number"
      onChange={(e) => {
        const nextValue = e.target.value

        setDraftScore(nextValue)
      }}
      onBlur={commitScore}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
    />
  )
}
