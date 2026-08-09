import { auth } from "@clerk/tanstack-react-start/server"
import { createServerFn } from "@tanstack/react-start"

export const getAuthState = createServerFn({ method: "GET" }).handler(
  async () => {
    const { isAuthenticated, userId } = await auth()

    return { isAuthenticated, userId }
  }
)

/**
 * The Convex JWT for the current session, used to authenticate queries that are
 * prefetched on the server. Only called during SSR, so the token never leaves
 * the server.
 */
export const getConvexToken = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getToken } = await auth()

    return await getToken({ template: "convex" })
  }
)
