import { v } from "convex/values";
import { userColors } from "../shared/constants/colors";
import { internalQuery, mutation, query, QueryCtx } from "./_generated/server";

export const store = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Called storeUser without authentication present");
		}

		// Check if we've already stored this identity before.
		// Note: If you don't want to define an index right away, you can use
		// ctx.db.query("users")
		//  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
		//  .unique();
		const user = await ctx.db
			.query("users")
			.withIndex("by_token", (q) =>
				q.eq("tokenIdentifier", identity.tokenIdentifier),
			)
			.unique();
		if (user !== null) {
			// If we've seen this identity before but the name has changed, patch the value.
			if (user.name !== identity.name) {
				await ctx.db.patch(user._id, { name: identity.name });
			}
			return user._id;
		}

		const colors = Object.keys(userColors);
		const color = colors[Math.floor(Math.random() * colors.length)];

		// If it's a new identity, create a new `User`.
		return await ctx.db.insert("users", {
			name: identity.name ?? "Anonymous",
			tokenIdentifier: identity.tokenIdentifier,
			gameColor: color,
		});
	},
});

export const getUserInternal = async (ctx: QueryCtx) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new Error("Unauthenticated call to query");
	}

	return await ctx.db
		.query("users")
		.withIndex("by_token", (q) =>
			q.eq("tokenIdentifier", identity.tokenIdentifier),
		)
		.unique();
};

export const getUser = query({
	handler: async (ctx) => {
		const user = await getUserInternal(ctx);
		if (!user) {
			throw new Error("Unauthenticated call to query");
		}
		return user;
	},
})

export const updateUserGameColor = mutation({
	args: {
		color: v.string(),
	},
	handler: async (ctx, { color }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthenticated call to mutation");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_token", (q) =>
				q.eq("tokenIdentifier", identity.tokenIdentifier),
			)
			.unique();

		if (!user) {
			throw new Error("User not found");
		}

		await ctx.db.patch(user._id, { gameColor: color });
	},
});

export const getUsers = query({
	handler: async (ctx) => {
		const user = await getUserInternal(ctx);
		if (!user) {
			throw new Error("Unauthenticated call to query");
		}

		return await ctx.db.query("users").filter(q => q.neq(q.field("_id"), user._id)).collect();
	},
})
