import { useEffect } from "react"

const serviceWorkerUrl = "/sw.js"

export function PwaRegistration() {
  useEffect(() => {
    if (import.meta.env.DEV || !("serviceWorker" in navigator)) {
      return
    }

    let isRefreshing = false

    const handleControllerChange = () => {
      if (isRefreshing) {
        return
      }

      isRefreshing = true
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange
    )

    void navigator.serviceWorker
      .register(serviceWorkerUrl, { scope: "/" })
      .then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" })
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing

          if (!worker) {
            return
          }

          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              worker.postMessage({ type: "SKIP_WAITING" })
            }
          })
        })
      })
      .catch((error: unknown) => {
        console.error("Service worker registration failed", error)
      })

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange
      )
    }
  }, [])

  return null
}
