import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"

export function Spinner({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <HugeiconsIcon
        icon={Loading03Icon}
        strokeWidth={2}
        className="size-5 animate-spin"
      />
      {children ? <span>{children}</span> : null}
    </div>
  )
}
