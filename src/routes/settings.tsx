import { createFileRoute, Link } from "@tanstack/react-router"

import { Header } from "@/components/common/header"
import { TertiaryHeader } from "@/components/common/text"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeSettingsCard } from "@/features/settings/theme-settings-card"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <>
      <Header title="Innstillinger">
        <Link
          to=".."
          className={buttonVariants({ variant: "link", size: "icon" })}
        >
          <ArrowLeftIcon className="size-6 text-foreground" />
        </Link>
      </Header>
      <main>
        <section className="space-y-6">
          {/* Color theme switcher */}
          <div className="space-y-2">
            <TertiaryHeader>Utseende</TertiaryHeader>
            <ThemeSettingsCard />
            <Separator />
          </div>
        </section>
      </main>
    </>
  )
}
