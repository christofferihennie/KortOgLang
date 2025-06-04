"use client";

import { api } from "#/_generated/api";
import { Combobox, ComboboxOption } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { XIcon } from "lucide-react";
import * as React from "react";

interface InvitePlayersProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function InvitePlayers({
  value = [],
  onChange,
}: InvitePlayersProps) {
  const otherUsers = useQuery(api.users.getUsers);

  const selectedUsers = React.useMemo(() => {
    return otherUsers?.filter((user) => value.includes(user._id)) || [];
  }, [otherUsers, value]);

  const options: ComboboxOption[] = otherUsers?.map((user) => ({
    value: user._id,
    label: user.name,
  })) || [];

  const handleComboboxSelect = (selectedValue: string | string[]) => {
    const userId = selectedValue as string;
    if (value.includes(userId)) {
      onChange(value.filter((id) => id !== userId));
    } else {
      onChange([...value, userId]);
    }
  };

  const handleRemove = (userId: string) => {
    onChange(value.filter((id) => id !== userId));
  };

  const displayText = selectedUsers.length > 0
    ? `${selectedUsers.length} spiller${selectedUsers.length !== 1 ? "e" : ""} valgt`
    : undefined;

  return (
    <>
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
      </div>

      <Combobox
        options={options}
        value={value}
        onChangeAction={handleComboboxSelect}
        placeholder="Velg spillere..."
        emptyText="Ingen spillere funnet."
        searchPlaceholder="Søk etter spillere..."
        multiple={true}
        displayText={displayText}
      />
    </>
  );
}
