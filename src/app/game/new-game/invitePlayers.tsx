"use client";

import { api } from "#/_generated/api";
import { useQuery } from "convex/react";
import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InvitePlayersProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function InvitePlayers({
  value = [],
  onChange,
}: InvitePlayersProps) {
  const otherUsers = useQuery(api.users.getUsers);
  const [open, setOpen] = React.useState(false);

  const selectedUsers = React.useMemo(() => {
    return otherUsers?.filter((user) => value.includes(user._id)) || [];
  }, [otherUsers, value]);

  const handleSelect = (userId: string) => {
    if (value.includes(userId)) {
      onChange(value.filter((id) => id !== userId));
    } else {
      onChange([...value, userId]);
    }
  };

  const handleRemove = (userId: string) => {
    onChange(value.filter((id) => id !== userId));
  };

  return (
    <div className="space-y-2">
      {/* Selected players */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
            >
              {user.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemove(user._id)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Player selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedUsers.length > 0
              ? `${selectedUsers.length} spiller${selectedUsers.length !== 1 ? "e" : ""} valgt`
              : "Velg spillere..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Søk etter spillere..." />
            <CommandList>
              <CommandEmpty>Ingen spillere funnet.</CommandEmpty>
              <CommandGroup>
                {otherUsers?.map((user) => (
                  <CommandItem
                    key={user._id}
                    value={user.name}
                    onSelect={() => {
                      handleSelect(user._id);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(user._id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {user.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
