"use client";

import { SignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { useStoreUserEffect } from "@/components/effects/useStoreUserEffect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PlayedGames from "../components/played-games";
import ActiveGames from "./(home)/active-games";
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
                        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-4'>
                            Kort og Lang
                        </h1>

                        <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
                            Dine aktive spill
                        </h3>
                        <ActiveGames />

                        <Separator className='my-2' />
                        <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
                            Dine siste spill
                        </h3>
                        <div className='space-y-4'>
                            <PlayedGames n={10} />
                            <Button>
                                <Link href='/game/finished-games'>Se alle dine spillte spill</Link>
                            </Button>
                        </div>
                    </Authenticated>
                    <Unauthenticated>
                        <SignIn />
                    </Unauthenticated>
                </>
            )}
        </main>
    );
}
