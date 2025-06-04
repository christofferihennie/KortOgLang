import { MobileNav, MobileNavItem } from "@/components/ui/mobile-nav";
import ConvexClientProvider from "@/contexts/ConvexProviderWithClerk";
import { ThemeProvider } from "@/contexts/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Home, Plus, User } from "lucide-react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
    appleWebApp: {
        title: 'Untitled',
        statusBarStyle: 'black-translucent',
    }
}

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
            <div className="flex flex-col h-screen justify-between">
            {children}
            <MobileNav>
              <MobileNavItem icon={<Home/>} label="Hjem" link="/"/>
              <MobileNavItem icon={<Plus/>} label="Nytt spill" link="/game/new-game"/>
              <MobileNavItem icon={<User/>} label="Profil" link="/profile"/>
            </MobileNav>
            </div>
          </ConvexClientProvider>
        </ClerkProvider>
       </ThemeProvider>
      </body>
    </html>
  );
}
