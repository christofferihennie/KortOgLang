import { SignIn } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

type SignInSearch = {
  redirect?: string
}

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search): SignInSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: SignInPage,
})

function SignInPage() {
  const { redirect } = Route.useSearch()
  const redirectUrl = getSafeRedirect(redirect)

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <SignIn
        routing="hash"
        forceRedirectUrl={redirectUrl}
        signUpForceRedirectUrl={redirectUrl}
      />
    </main>
  )
}

function getSafeRedirect(redirect: string | undefined) {
  if (redirect?.startsWith("/") && !redirect.startsWith("//")) {
    return redirect
  }

  return "/"
}
