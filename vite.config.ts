import { createLogger, defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const logger = createLogger()

function getManualChunk(id: string) {
  if (!id.includes("/node_modules/")) {
    return
  }

  if (id.includes("/@tanstack/")) {
    return "app-vendor"
  }

  if (id.includes("/@base-ui/")) {
    return "base-ui"
  }

  if (
    id.includes("/better-auth/") ||
    id.includes("/@convex-dev/") ||
    id.includes("/convex/")
  ) {
    return "app-vendor"
  }

  if (id.includes("/react/") || id.includes("/react-dom/")) {
    return "react"
  }
}

function shouldIgnoreBuildWarning(message: string) {
  return (
    message.includes(
      'Module level directives cause errors when bundled, "use client"'
    ) ||
    message.includes("Generated an empty chunk:") ||
    (message.includes("imported from external module") &&
      message.includes("but never used in"))
  )
}

const customLogger = {
  ...logger,
  warn(message: string, options?: Parameters<typeof logger.warn>[1]) {
    if (shouldIgnoreBuildWarning(message)) {
      return
    }

    logger.warn(message, options)
  },
}

const config = defineConfig({
  customLogger,
  ssr: {
    noExternal: ["@convex-dev/better-auth"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: getManualChunk,
      },
    },
  },
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
