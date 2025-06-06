"use client";

import { api } from "#/_generated/api";
import { userColors } from "%/constants/colors";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";

export default function UserGameColor(props: {
  preloadedUser: Preloaded<typeof api.users.getUser>;
}) {
  const user = usePreloadedQuery(props.preloadedUser);
  const updateUserGameColor = useMutation(api.users.updateUserGameColor);

  const availableColors = Object.entries(userColors);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <span
            className={`${user?.gameColor ? userColors[user.gameColor as keyof typeof userColors] : userColors.slate} h-4 w-4 rounded-full`}
          />{" "}
          {user?.gameColor || "slate"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="grid grid-cols-2 gap-4">
          {availableColors.map(([name, color]) => (
            <Button
              key={color}
              variant="outline"
              onClick={() => updateUserGameColor({ color: name })}
            >
              <span className={`${color} h-4 w-4 rounded-full`} /> {name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
