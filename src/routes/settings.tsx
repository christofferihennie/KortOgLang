import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, createFileRoute } from "@tanstack/react-router"

import { Header } from "@/components/common/header"
import { buttonVariants } from "@/components/ui/button"
import { ThemeSettingsCard } from "@/features/settings/theme-settings-card"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <main>
      <Header title="Innstillinger" />
      <section className="space-y-6">
        <ThemeSettingsCard />
        <div className="space-y-2 border-t border-border/60 pt-5">
          <p className="max-w-xl text-sm text-muted-foreground">
            Your choice is saved locally. System mode updates automatically when
            your operating system theme changes.
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-fit gap-2 px-0"
            )}
            to="/"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              className="size-4"
              strokeWidth={2}
            />
            Back to home
          </Link>
        </div>
      </section>
    </main>
  )
}
