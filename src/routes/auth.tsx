import { SignIn } from "@/features/auth/sign-in"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
  component: SignIn,
})
