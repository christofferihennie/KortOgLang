import { createFileRoute } from "@tanstack/react-router"

import { SignInCard } from "@/components/auth/auth-forms"

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
})

function SignInPage() {
  return <SignInCard />
}
