"use client";

import { useStoreUserEffect } from "@/components/effects/useStoreUserEffect";
import { Separator } from "@/components/ui/separator";
import { SignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import ActiveGames from "./(home)/active-games";
import PlayedGames from "./(home)/played-games";
import Loading from "./loading";

export default function Home() {
  const { isLoading } = useStoreUserEffect();

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Authenticated>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-4">
              Kort og Lang
            </h1>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Dine aktive spill
            </h3>
            <ActiveGames />

            <Separator className="my-2" />
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Dine siste spill
            </h3>
            <PlayedGames />
          </Authenticated>
          <Unauthenticated>
            <SignIn />
          </Unauthenticated>
        </>
      )}
    </main>
  );
}
