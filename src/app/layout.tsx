import { MobileNav, MobileNavItem } from "@/components/ui/mobile-nav";
import ConvexClientProvider from "@/contexts/ConvexProviderWithClerk";
import { PostHogProvider } from "@/contexts/PostHog-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { metadata } from "@/lib/metadata";
import { ClerkProvider } from "@clerk/nextjs";
import { Home, Plus, User } from "lucide-react";
import type { Viewport } from "next";
import "./globals.css";

export { metadata };

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          >
            <ConvexClientProvider>
              <PostHogProvider>
                <div className="h-[100svh] flex flex-col overflow-y-auto">
                  <main className="flex-1 mx-4 mt-6 pb-32">{children}</main>
                  <MobileNav>
                    <MobileNavItem icon={<Home />} label="Hjem" link="/" />
                    <MobileNavItem
                      icon={<Plus />}
                      label="Nytt spill"
                      link="/game/new-game"
                    />
                    <MobileNavItem
                      icon={<User />}
                      label="Profil"
                      link="/profile"
                    />
                  </MobileNav>
                </div>
              </PostHogProvider>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
