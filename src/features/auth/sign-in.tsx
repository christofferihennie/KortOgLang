import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import type { SVGProps } from "react"
import { useState } from "react"
import { toast } from "sonner"

export function SignIn() {
  const [googlePending, setGooglePending] = useState(false)

  return (
    <main className="grid h-screen place-content-center">
      <Card>
        <CardHeader>
          <CardTitle>Logg inn</CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleButton pending={googlePending} setPending={setGooglePending} />
        </CardContent>
      </Card>
    </main>
  )
}

const AUTH_REDIRECT = "/"
type AuthError = { error: { message?: string } }

function GoogleButton({
  pending,
  setPending,
}: {
  pending: boolean
  setPending: (pending: boolean) => void
}) {
  const handleGoogleSignIn = async () => {
    setPending(true)

    await authClient.signIn.social({
      provider: "google",
      callbackURL: AUTH_REDIRECT,
      newUserCallbackURL: AUTH_REDIRECT,
      fetchOptions: {
        onResponse: () => setPending(false),
        onError: ({ error: authError }: AuthError) => {
          setPending(false)
          console.error(authError)

          toast.error("Det oppsto en feil.", {
            description: authError.message,
          })
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
      {pending ? "Går til Google..." : "Logg inn med Google"}
    </Button>
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
