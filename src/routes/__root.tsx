import themeInitScript from "@/features/settings/theme-init-script.ts?raw"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import type { ConvexQueryClient } from "@convex-dev/react-query"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { createServerFn } from "@tanstack/react-start"
import * as React from "react"
import appCss from "../styles.css?url"

import { CenterLayout } from "@/components/common/layout"
import { MenuBar } from "@/components/common/navigation"
import { PwaRegistration } from "@/components/common/pwa-registration"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/features/settings/theme-provider"
import { authClient } from "@/lib/auth-client"
import { pwaLinks, pwaMeta } from "@/lib/pwa"
import { getToken } from "@/lib/auth-server"

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken()
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        title: "Kort og lang",
      },
      ...pwaMeta,
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      ...pwaLinks,
    ],
  }),
  beforeLoad: async (ctx) => {
    const token = await getAuth()

    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }

    return {
      isAuthenticated: Boolean(token),
      token,
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const context = useRouteContext({ from: Route.id })

  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      authClient={authClient}
      initialToken={context.token}
    >
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ConvexBetterAuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <CenterLayout className="mb-32">
            {children}
            <MenuBar />
          </CenterLayout>
          <Toaster richColors={true} />
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <PwaRegistration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
