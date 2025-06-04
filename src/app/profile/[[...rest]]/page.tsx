"use client";

import { UserButton } from "@clerk/nextjs";
import { Authenticated } from "convex/react";

export default function ProfilePage() {
  return (
    <div className="">
      <Authenticated>
        <UserButton/>
      </Authenticated>
    </div>
  );
}
