"use client";

import { useStoreUserEffect } from "@/components/effects/useStoreUserEffect";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import GameList from "./game-list";

export default function Home() {
  const { isLoading } = useStoreUserEffect();

  return (
    <main>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Authenticated>
            <GameList />
            <UserButton />
            <ModeToggle/>
          </Authenticated>
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
        </>
      )}
    </main>
  );
}
