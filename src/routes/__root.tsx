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
        title: "Kort Og Lang",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
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
        <Scripts />
      </body>
    </html>
  )
}
