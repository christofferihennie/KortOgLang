import { ConvexQueryClient } from "@convex-dev/react-query"
import { notifyManager } from "@tanstack/query-core"
import { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import { ConvexProvider } from "convex/react"

import { routeTree } from "./routeTree.gen"
import { env } from "@/env"

export function getRouter() {
  if (typeof document !== "undefined") {
    notifyManager.setScheduler(window.requestAnimationFrame)
  }

  const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL, {
    expectAuth: true,
  })

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })

  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: "intent",
      defaultPreloadStaleTime: 0,
      context: {
        queryClient,
        convexQueryClient,
      },
      scrollRestoration: true,
      defaultErrorComponent: ({ error }) => (
        <p className="p-6 text-sm text-destructive">{error.message}</p>
      ),
      defaultNotFoundComponent: () => (
        <p className="p-6 text-sm text-muted-foreground">Not found.</p>
      ),
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      ),
    }),
    queryClient
  )

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
