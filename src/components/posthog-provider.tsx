import posthog from "posthog-js"
import { useLocation } from "@tanstack/react-router"
import { useEffect, type ReactNode } from "react"

import { env } from "@/env"

export function PostHogProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const posthogKey = env.VITE_POSTHOG_KEY

  useEffect(() => {
    if (!posthogKey || posthog.__loaded) return

    posthog.init(posthogKey, {
      api_host: env.VITE_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false,
    })
  }, [posthogKey])

  useEffect(() => {
    if (!posthogKey || !posthog.__loaded) return
    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${location.pathname}${location.searchStr}`,
    })
  }, [location.pathname, location.searchStr, posthogKey])

  return children
}
