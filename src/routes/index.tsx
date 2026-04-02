import { useState } from "react"
import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "../../convex/_generated/api"
import type { FormEvent } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

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
    <main className="relative min-h-svh overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,166,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.16),transparent_24%),linear-gradient(180deg,rgba(255,248,235,0.96),rgba(255,255,255,0.98))]" />
      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:px-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase shadow-sm backdrop-blur">
              TanStack Start + Convex + Better Auth
            </div>
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-medium tracking-[0.22em] text-primary uppercase">
                New scaffold
              </p>
              <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                Typed auth and realtime data in one clean starter.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                This rebuild proxies Better Auth through TanStack Start, keeps
                Convex ready for SSR queries, and validates app environment
                variables with `t3-env`.
              </p>
            </div>
            <Alert className="max-w-xl border-primary/15 bg-background/80 shadow-sm">
              <AlertTitle>What is wired in</AlertTitle>
              <AlertDescription>
                Convex deployment, Better Auth email/password flows, TanStack
                Start auth proxy routes, SSR-ready query context, and type-safe
                frontend env access.
              </AlertDescription>
            </Alert>
          </div>
          <div>{isAuthenticated ? <AuthenticatedPanel /> : <AuthPanel />}</div>
        </section>
      </div>
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
          Sign out reloads the page so `expectAuth: true` resets cleanly.
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

function AuthPanel() {
  return (
    <div className="grid gap-4">
      <SignInCard />
      <SignUpCard />
    </div>
  )
}

function SignInCard() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    await authClient.signIn.email(
      { email, password },
      {
        onRequest: () => setPending(true),
        onResponse: () => setPending(false),
        onSuccess: () => {
          location.reload()
        },
        onError: ({ error: authError }: { error: { message?: string } }) => {
          setError(authError.message || "Unable to sign in.")
        },
      }
    )
  }

  return (
    <Card className="border-border/70 bg-background/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Use the Better Auth email/password flow proxied through TanStack
          Start.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sign-in-email">Email</Label>
            <Input
              id="sign-in-email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sign-in-password">Password</Label>
            <Input
              id="sign-in-password"
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Sign-in failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function SignUpCard() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    await authClient.signUp.email(
      { name, email, password },
      {
        onRequest: () => setPending(true),
        onResponse: () => setPending(false),
        onSuccess: () => {
          location.reload()
        },
        onError: ({ error: authError }: { error: { message?: string } }) => {
          setError(authError.message || "Unable to create the account.")
        },
      }
    )
  }

  return (
    <Card className="border-border/70 bg-background/85 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.28)] backdrop-blur">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          The starter ships with email/password enabled and email verification
          off.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sign-up-name">Name</Label>
              <Input
                id="sign-up-name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sign-up-email">Email</Label>
              <Input
                id="sign-up-email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sign-up-password">Password</Label>
            <Input
              id="sign-up-password"
              autoComplete="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Sign-up failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
