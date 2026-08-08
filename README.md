# Kort og Lang

The TanStack Start frontend uses Clerk for authentication and sends Clerk session
tokens to Convex through `ConvexProviderWithClerk`.

## Local setup

Copy `.env.example` to `.env.local` and fill in the Clerk and Convex values. The
Clerk Convex integration must be activated, and `CLERK_FRONTEND_API_URL` must also
be configured on the Convex deployment. After changing `convex/auth.config.ts`,
run the normal Convex development or deployment command so the auth provider is
synced.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
