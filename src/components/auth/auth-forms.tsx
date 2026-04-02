import type { FormEvent, SVGProps } from "react"
import { useState } from "react"
import { Link } from "@tanstack/react-router"

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

const AUTH_REDIRECT = "/"

type AuthError = { error: { message?: string } }

export function SignInCard() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    await authClient.signIn.email(
      { email, password, callbackURL: AUTH_REDIRECT },
      {
        onRequest: () => setPending(true),
        onResponse: () => setPending(false),
        onSuccess: () => {
          location.assign(AUTH_REDIRECT)
        },
        onError: ({ error: authError }: AuthError) => {
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
          Continue with Google or use the Better Auth email/password flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <GoogleButton
          pending={googlePending}
          setPending={setGooglePending}
          setError={setError}
        />
        <Divider label="Or use email" />
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
          <Button type="submit" disabled={pending || googlePending}>
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border/70 pt-6">
        <p className="text-sm text-muted-foreground">
          Need an account?{" "}
          <Link className="font-medium text-foreground underline" to="/auth/sign-up">
            Create one here
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  )
}

export function SignUpCard() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    await authClient.signUp.email(
      { name, email, password, callbackURL: AUTH_REDIRECT },
      {
        onRequest: () => setPending(true),
        onResponse: () => setPending(false),
        onSuccess: () => {
          location.assign(AUTH_REDIRECT)
        },
        onError: ({ error: authError }: AuthError) => {
          setError(authError.message || "Unable to create the account.")
        },
      }
    )
  }

  return (
    <Card className="border-border/70 bg-background/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Start with Google or create an email/password account in the same
          auth flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <GoogleButton
          pending={googlePending}
          setPending={setGooglePending}
          setError={setError}
        />
        <Divider label="Or create an account with email" />
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
          <Button type="submit" disabled={pending || googlePending}>
            {pending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border/70 pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-foreground underline" to="/auth/sign-in">
            Sign in instead
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  )
}

function GoogleButton({
  pending,
  setPending,
  setError,
}: {
  pending: boolean
  setPending: (pending: boolean) => void
  setError: (error: string | null) => void
}) {
  const handleGoogleSignIn = async () => {
    setPending(true)
    setError(null)

    await authClient.signIn.social({
      provider: "google",
      callbackURL: AUTH_REDIRECT,
      newUserCallbackURL: AUTH_REDIRECT,
      fetchOptions: {
        onResponse: () => setPending(false),
        onError: ({ error: authError }: AuthError) => {
          setPending(false)
          setError(authError.message || "Unable to continue with Google.")
        },
      },
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full justify-center gap-3"
      disabled={pending}
      onClick={handleGoogleSignIn}
    >
      <GoogleIcon className="size-4" />
      {pending ? "Redirecting to Google..." : "Continue with Google"}
    </Button>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border/80" />
      <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/80" />
    </div>
  )
}

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 18 18" {...props}>
      <path
        d="M16.533 9.205c0-.602-.054-1.18-.154-1.737H9v3.287h4.215a3.6 3.6 0 0 1-1.566 2.36v1.96h2.525c1.477-1.36 2.33-3.366 2.33-5.87Z"
        fill="#4285F4"
      />
      <path
        d="M9 16.875c2.115 0 3.89-.7 5.187-1.897l-2.525-1.96c-.7.47-1.596.748-2.662.748-2.046 0-3.78-1.382-4.4-3.24H2v2.023a7.83 7.83 0 0 0 7 4.326Z"
        fill="#34A853"
      />
      <path
        d="M4.6 10.526A4.694 4.694 0 0 1 4.354 9c0-.53.09-1.045.246-1.526V5.451H2A7.875 7.875 0 0 0 1.125 9c0 1.27.305 2.472.875 3.549l2.6-2.023Z"
        fill="#FBBC04"
      />
      <path
        d="M9 4.234c1.15 0 2.183.396 2.997 1.173l2.247-2.247C12.886 1.894 11.114 1.125 9 1.125a7.83 7.83 0 0 0-7 4.326l2.6 2.023c.62-1.857 2.354-3.24 4.4-3.24Z"
        fill="#EA4335"
      />
    </svg>
  )
}
