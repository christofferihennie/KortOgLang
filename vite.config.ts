import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    // routeTree.gen.ts is formatted by the router plugin's own bundled Prettier,
    // not by oxfmt. Pin the style here so it matches the rest of the codebase.
    tanstackStart({ router: { quoteStyle: "double", semicolons: false } }),
    viteReact(),
  ],
})

export default config
