import { createFileRoute } from "@tanstack/react-router"

import { Header } from "@/components/common/header"
import { TertiaryHeader } from "@/components/common/text"
import { Separator } from "@/components/ui/separator"
import { ThemeSettingsCard } from "@/features/settings/theme-settings-card"

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <main>
      <Header title="Innstillinger" back={true} />
      <section className="space-y-6 pt-6">
        {/* Color theme switcher */}
        <div className="space-y-2">
          <TertiaryHeader>Utseende</TertiaryHeader>
          <ThemeSettingsCard />
          <Separator />
        </div>
      </section>
    </main>
  )
}
