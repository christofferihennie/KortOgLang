import { Link, useRouterState } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const authNavigation = [
  { label: "Sign in", to: "/auth/sign-in" as const },
  { label: "Create account", to: "/auth/sign-up" as const },
]

export function AuthShell({
  badge,
  eyebrow,
  title,
  description,
  children,
}: {
  badge: string
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <main className="relative min-h-svh overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,166,0.18),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(245,158,11,0.2),transparent_26%),linear-gradient(180deg,rgba(255,248,235,0.95),rgba(255,255,255,0.98))]" />
      <div className="relative mx-auto grid min-h-svh w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10">
        <section className="flex flex-col gap-6">
          <div className="inline-flex w-fit rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase shadow-sm backdrop-blur">
            {badge}
          </div>
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium tracking-[0.22em] text-primary uppercase">
              {eyebrow}
            </p>
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <AuthMetric
              label="Email + password"
              value="Built in"
              description="Native Better Auth forms"
            />
            <AuthMetric
              label="Google OAuth"
              value="Enabled"
              description="Social sign-in from the same flow"
            />
            <AuthMetric
              label="Route split"
              value="/auth/*"
              description="Dedicated pages for auth state"
            />
          </div>
        </section>
        <section className="rounded-[2rem] border border-border/70 bg-background/88 p-2 shadow-[0_28px_120px_-48px_rgba(15,23,42,0.42)] backdrop-blur">
          <div className="grid grid-cols-2 gap-2 rounded-[1.6rem] bg-muted/70 p-2">
            {authNavigation.map((item) => {
              const isActive = pathname === item.to

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    buttonVariants({
                      variant: isActive ? "default" : "ghost",
                      size: "lg",
                    }),
                    "w-full"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
          <div className="p-4 sm:p-5">{children}</div>
        </section>
      </div>
    </main>
  )
}

function AuthMetric({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/70 p-4 shadow-sm backdrop-blur">
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-lg font-medium text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
