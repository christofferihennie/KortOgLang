import { createClient } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { betterAuth } from "better-auth/minimal"

import type { AuthFunctions, GenericCtx } from "@convex-dev/better-auth"
import { ConvexError } from "convex/values"
import { USER_COLORS } from "../shared/colors"
import { components, internal } from "./_generated/api"
import type { DataModel } from "./_generated/dataModel"
import type { MutationCtx, QueryCtx } from "./_generated/server"
import { query } from "./_generated/server"
import authConfig from "./auth.config"
import { env } from "./env"

const authFunctions: AuthFunctions = internal.auth
const userColorKeys = Object.keys(USER_COLORS) as Array<
  keyof typeof USER_COLORS
>

function pickRandomGameColor() {
  const randomIndex = Math.floor(Math.random() * userColorKeys.length)

  return userColorKeys[randomIndex]
}

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        await ctx.db.insert("users", {
          name: doc.name,
          betterAuthId: doc._id,
          gameColor: pickRandomGameColor(),
        })
      },
    },
  },
})

export function getAuthOptions(ctx: GenericCtx<DataModel>) {
  return {
    baseURL: env.SITE_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.SITE_URL],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    plugins: [convex({ authConfig })],
  }
}

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(getAuthOptions(ctx))
}

export const getCurrentBetterAuthUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx)
  },
})

export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    throw new Error("Not authenticated")
  }
  return identity
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const current = await getCurrentUserOrThrow(ctx)

  const user = await ctx.db
    .query("users")
    .withIndex("by_betterAuthId", (q) => q.eq("betterAuthId", current.subject))
    .first()

  return user
}

export const getCurrentPlayer = query({
  handler: async (ctx) => {
    const player = await getCurrentUser(ctx)

    if (!player) {
      throw new ConvexError({
        message: "Fant ingen spiller",
        code: 500,
        severity: "high",
      })
    }

    return player
  },
})

export const { onCreate } = authComponent.triggersApi()
