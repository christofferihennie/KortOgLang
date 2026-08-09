import { useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"

import { api } from "../../../convex/_generated/api"
import { userColors } from "../../../shared/constants/colors"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function GameColorPicker({ color }: { color?: string }) {
  const updateColor = useMutation(api.users.updateUserGameColor)
  const [open, setOpen] = useState(false)
  const currentColor = color && color in userColors ? color : "slate"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button type="button" variant="outline">
            <span
              className={`${userColors[currentColor as keyof typeof userColors]} size-4 rounded-full`}
            />
            {currentColor}
          </Button>
        }
      />
      <PopoverContent className="w-fit">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(userColors).map(([name, className]) => (
            <Button
              key={name}
              type="button"
              variant="outline"
              onClick={() => {
                void updateColor({ color: name })
                  .then(() => setOpen(false))
                  .catch((error: unknown) => {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "Kunne ikke oppdatere fargen"
                    )
                  })
              }}
            >
              <span className={`${className} size-4 rounded-full`} />
              {name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
