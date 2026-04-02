import { createAuthClient } from "better-auth/react"
import { convexClient } from "@convex-dev/better-auth/client/plugins"

import { env } from "@/env"

export const authClient = createAuthClient({
  baseURL: env.VITE_SITE_URL,
  plugins: [convexClient()],
})
