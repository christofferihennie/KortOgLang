import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"

export function Header({
  children,
  backButton = false,
}: {
  children: ReactNode
  backButton?: boolean
}) {
  const router = useRouter()

  return (
    <header className="mb-4 flex items-center gap-3">
      {backButton ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Gå tilbake"
          onClick={() => router.history.back()}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
      ) : null}
      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
        {children}
      </h1>
    </header>
  )
}
