import { convexQuery } from "@convex-dev/react-query"

import { api } from "../../../convex/_generated/api"

export const locationsQuery = convexQuery(api.locations.getLocations, {})
export const usersQuery = convexQuery(api.users.getUsers, {})
