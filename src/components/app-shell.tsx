import {
  Add01Icon,
  Home01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, useLocation } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const navigation = [
  { to: "/", label: "Hjem", icon: Home01Icon },
  { to: "/game/new-game", label: "Nytt spill", icon: Add01Icon },
  { to: "/profile", label: "Profil", icon: UserCircleIcon },
] as const

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()

  if (location.pathname === "/sign-in") {
    return children
  }

  return (
    <div className="flex h-svh flex-col overflow-y-auto">
      <main className="mx-4 mt-6 flex-1 pb-32">{children}</main>
      <nav
        aria-label="Hovednavigasjon"
        className="fixed right-0 bottom-0 left-0 z-50 flex w-full justify-evenly gap-4 rounded-t-lg border-t bg-linear-to-t from-neutral-300 to-card py-6 pb-10 shadow-sm dark:from-gray-900"
      >
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== "/" && location.pathname.startsWith(item.to))

          return (
            <Link
              key={item.to}
              to={item.to}
              className="m-1 flex flex-col items-center"
            >
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className={cn(
                  "size-6 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  isActive
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
