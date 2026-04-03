import { MonitorCogIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const OPTIONS = [
  {
    value: "light",
    label: "Lys modus",
    description: "Bruk alltid lys modus.",
    icon: SunIcon,
  },
  {
    value: "dark",
    label: "Mørk modus",
    description: "Bruk alltid mørk modus.",
    icon: MoonIcon,
  },
  {
    value: "system",
    label: "System",
    description: "Følg system preferanser.",
    icon: MonitorCogIcon,
  },
] as const

export function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const currentTheme = toThemeValue(theme)
  const selectedTheme = mounted ? (currentTheme ?? "system") : undefined

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-border/70 bg-muted/40 p-1.5">
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          {OPTIONS.map((option) => {
            const selected = selectedTheme === option.value

            return (
              <Button
                key={option.value}
                type="button"
                variant="ghost"
                onClick={() => setTheme(option.value)}
                aria-pressed={selected}
                className={cn(
                  "h-auto min-h-16 justify-start rounded-[1.35rem] px-4 py-3 text-left sm:min-h-24 sm:flex-col sm:items-start sm:justify-center",
                  selected
                    ? "bg-background text-foreground shadow-[0_12px_30px_-18px_rgba(15,23,42,0.4)] ring-1 ring-border"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                )}
              >
                <span className="flex w-full items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                  <span
                    className={cn(
                      "rounded-2xl p-2",
                      selected
                        ? "bg-primary/10 text-primary"
                        : "bg-background/70"
                    )}
                  >
                    <option.icon className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-semibold">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </span>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function toThemeValue(value: string | undefined) {
  if (value === "light" || value === "dark" || value === "system") {
    return value
  }

  return undefined
}
