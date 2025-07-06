import { api } from "#/_generated/api";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { getAuthToken } from "@/lib/serverSideAuth";
import { SignOutButton } from "@clerk/nextjs";
import { preloadQuery } from "convex/nextjs";
import { Suspense } from "react";
import DynamicUserProfile from "./dynamicUserProfile";
import UserGameColor from "./userGameColor";

export default async function ProfilePage() {
  const token = await getAuthToken();
  const preloadedUser = await preloadQuery(api.users.getUser, {}, { token });

  return (
    <>
      <Header>Din profil</Header>
      <div className="flex justify-between align-baseline gap-4 my-4">
        <Button variant={"destructive"} asChild>
          <SignOutButton>Logg ut</SignOutButton>
        </Button>
        <span className="flex gap-2">
          <UserGameColor preloadedUser={preloadedUser} />
          <ThemeSwitcher />
        </span>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicUserProfile />
      </Suspense>
    </>
  );
}
