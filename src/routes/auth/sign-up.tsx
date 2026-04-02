import { createFileRoute } from "@tanstack/react-router"

import { SignUpCard } from "@/components/auth/auth-forms"

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
})

function SignUpPage() {
  return <SignUpCard />
}
