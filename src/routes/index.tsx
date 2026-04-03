import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import { Settings02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { api } from "../../convex/_generated/api"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async ({ context }) => {
    if (!context.isAuthenticated) {
      return
    }

    await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getCurrentUser, {})
    )
  },
})

function HomePage() {
  const isAuthenticated = Route.useRouteContext({
    select: (context) => context.isAuthenticated,
  })

  return (
    <main className="space-y-4 py-8">
      <div className="flex justify-end">
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          to="/settings"
        >
          <HugeiconsIcon icon={Settings02Icon} className="size-4" strokeWidth={2} />
          Settings
        </Link>
      </div>
      {isAuthenticated ? <AuthenticatedPanel /> : <GuestPanel />}
    </main>
  )
}

function AuthenticatedPanel() {
  const { data: user } = useSuspenseQuery(
    convexQuery(api.auth.getCurrentUser, {})
  )

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          location.reload()
        },
      },
    })
  }

  return (
    <Card className="border-border/70 bg-background/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur">
      <CardHeader>
        <CardTitle>Authenticated</CardTitle>
        <CardDescription>
          The current session is coming from Better Auth and the profile query
          is served through Convex.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <div className="rounded-2xl border border-border/70 bg-muted/50 p-4">
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Signed in as
          </p>
          <p className="mt-2 text-lg font-medium text-foreground">
            {user.name || "Unnamed user"}
          </p>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Better Auth user id" value={user._id} />
          <Metric
            label="Email verified"
            value={user.emailVerified ? "Yes" : "No"}
          />
          <Metric label="Source" value="Convex query" />
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Sign out reloads the page so the auth state resets cleanly.
        </p>
        <Button variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
      </CardFooter>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4">
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  )
}

function GuestPanel() {
  return (
    <Card className="border-border/70 bg-background/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur">
      <CardHeader>
        <CardTitle>Authentication moved into dedicated routes</CardTitle>
        <CardDescription>
          Use the dedicated auth pages for email/password or Google sign-in,
          while the home route stays focused on the signed-in experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border/70 bg-muted/50 p-4">
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Auth routes
          </p>
          <p className="mt-2 text-lg font-medium text-foreground">
            `/auth/sign-in` and `/auth/sign-up`
          </p>
          <p className="mt-2 text-muted-foreground">
            Google OAuth and Better Auth email flows now live outside the
            landing page.
          </p>
        </div>
      </CardContent>
      <CardFooter className="gap-3">
        <Link className={buttonVariants()} to="/auth">
          Sign in
        </Link>
        <Link className={cn(buttonVariants({ variant: "outline" }))} to="/auth">
          Create account
        </Link>
      </CardFooter>
    </Card>
  )
}
