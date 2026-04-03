import { cn } from "@/lib/utils"
import { Link, useMatchRoute } from "@tanstack/react-router"
import { ChartColumnIcon, HouseIcon, PlusIcon } from "lucide-react"

const LINKS = [
  {
    label: "Hjem",
    path: "/",
    icon: HouseIcon,
  },
  {
    label: "Nytt spill",
    path: "/games/new",
    icon: PlusIcon,
  },
  {
    label: "Historikk",
    path: "/games/history",
    icon: ChartColumnIcon,
  },
] as const

export function MenuBar() {
  const matchRoute = useMatchRoute()

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex w-full justify-evenly gap-4 rounded-t-lg border-t border-t-border bg-linear-to-t from-neutral-300 to-card py-6 pb-10 shadow-sm dark:from-gray-900">
      {LINKS.map((link) => {
        const isActive = Boolean(
          matchRoute({
            to: link.path,
            fuzzy: link.path !== "/",
          })
        )

        return (
          <Link
            to={link.path}
            key={link.path}
            className="m-1 flex flex-col items-center"
          >
            <div
              className={cn(
                "transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <link.icon />
            </div>
            <span
              className={cn(
                "text-sm transition-colors",
                isActive ? "font-medium text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
