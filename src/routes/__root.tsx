import type { ConvexQueryClient } from "@convex-dev/react-query"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  redirect,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { ThemeProvider } from "next-themes"

import { AppShell } from "@/components/app-shell"
import { PostHogProvider } from "@/components/posthog-provider"
import { StartupImages } from "@/components/startup-images"
import { Toaster } from "@/components/ui/sonner"
import { getAuthState, getConvexToken } from "@/lib/auth"
import { api } from "../../convex/_generated/api"
import appCss from "../styles.css?url"

const SIGN_IN_PATH = "/sign-in"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}>()({
  beforeLoad: async ({ context, location }) => {
    const authState = await getAuthState()
    const isSignInPage = location.pathname === SIGN_IN_PATH

    if (!authState.isAuthenticated && !isSignInPage) {
      throw redirect({
        to: SIGN_IN_PATH,
        search: { redirect: location.href },
      })
    }

    if (authState.isAuthenticated && isSignInPage) {
      throw redirect({ to: "/" })
    }

    // Server-rendered loaders talk to Convex over HTTP and need the token
    // explicitly; on the client ConvexProviderWithClerk handles it.
    if (import.meta.env.SSR && authState.isAuthenticated) {
      const token = await getConvexToken()
      const convexHttpClient = context.convexQueryClient.serverHttpClient

      if (token && convexHttpClient) {
        convexHttpClient.setAuth(token)
        // Queries look the caller up in the `users` table, so the row has to
        // exist before any of them run. `store` is idempotent.
        await convexHttpClient.mutation(api.users.store, {})
      }
    }

    return { userId: authState.userId }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Kort og Lang",
      },
      {
        name: "description",
        content:
          "Hold oversikt, se statistikk, og kjemp om å være den med de beste kortene!",
      },
      {
        name: "theme-color",
        content: "#234E6B",
      },
      {
        name: "robots",
        content: "noindex, nofollow, nocache",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "apple-touch-icon",
        href: "/manifest-icon-192.maskable.png",
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <StartupImages />
            <AppShell>{children}</AppShell>
          </PostHogProvider>
          <Toaster />
          {import.meta.env.DEV ? (
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          ) : null}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
