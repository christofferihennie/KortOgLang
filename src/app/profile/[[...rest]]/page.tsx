import { api } from "#/_generated/api";
import { Button } from "@/components/ui/button";
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
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
        Din profil
      </h2>
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
