"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function DynamicUserProfile() {
  const { resolvedTheme } = useTheme();

  return resolvedTheme === "dark" ? (
    <UserProfile
      appearance={{
        baseTheme: dark,
      }}
    />
  ) : (
    <UserProfile />
  );
}
