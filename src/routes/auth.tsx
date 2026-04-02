import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { AuthShell } from "@/components/auth/auth-shell"

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <AuthShell
      badge="Better Auth access"
      eyebrow="Dedicated auth routes"
      title="Sign in without turning the home page into a form dump."
      description="Authentication now lives in its own route flow, with Google social sign-in and email/password support sharing the same Better Auth backend."
    >
      <Outlet />
    </AuthShell>
  )
}
