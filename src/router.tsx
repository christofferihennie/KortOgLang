import { createRouter } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { nbNO } from "@clerk/localizations"
import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start"
import { ConvexQueryClient } from "@convex-dev/react-query"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { env } from "./env"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: { queryClient },
    scrollRestoration: true,
    InnerWrap: ({ children }) => (
      <ClerkProvider
        publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
        localization={nbNO}
      >
        <ConvexProviderWithClerk
          client={convexQueryClient.convexClient}
          useAuth={useAuth}
        >
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    ),
  })
  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
