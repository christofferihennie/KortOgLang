import { defineNitroConfig } from "nitro/config"

export default defineNitroConfig({
  rollupConfig: {
    onwarn(warning, warn) {
      if (
        warning.code === "MODULE_LEVEL_DIRECTIVE" ||
        warning.code === "UNUSED_EXTERNAL_IMPORT"
      ) {
        return
      }

      warn(warning)
    },
  },
})
