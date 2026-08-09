import { UserProfile, SignOutButton } from "@clerk/tanstack-react-start"
import { dark } from "@clerk/themes"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTheme } from "next-themes"

import { GameColorPicker } from "@/components/profile/game-color-picker"
import { ProfileLoading } from "@/components/profile/profile-loading"
import { profileUserQuery } from "@/components/profile/profile-queries"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"

export const Route = createFileRoute("/profile")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(profileUserQuery)
  },
  pendingComponent: ProfileLoading,
  errorComponent: ProfileError,
  component: ProfilePage,
})

function ProfilePage() {
  const { data: user } = useSuspenseQuery(profileUserQuery)
  const { resolvedTheme } = useTheme()

  return (
    <>
      <Header>Din profil</Header>
      <div className="my-4 flex justify-between gap-4">
        <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
          <Button type="button" variant="destructive">
            Logg ut
          </Button>
        </SignOutButton>
        <span className="flex gap-2">
          <GameColorPicker color={user.gameColor} />
          <ThemeSwitcher />
        </span>
      </div>
      <UserProfile
        routing="hash"
        appearance={resolvedTheme === "dark" ? dark : undefined}
      />
    </>
  )
}

function ProfileError({ error }: { error: Error }) {
  return (
    <div className="space-y-2">
      <Header>Din profil</Header>
      <p className="text-destructive">
        Kunne ikke laste profilen: {error.message}
      </p>
    </div>
  )
}
