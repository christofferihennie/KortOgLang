"use client";

import { api } from "#/_generated/api";
import { Combobox, type ComboboxOption } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { XIcon } from "lucide-react";
import * as React from "react";

interface InvitePlayersProps {
  value: string[];
  onChangeAction: (value: string[]) => void;
}

export default function InvitePlayers({
  value = [],
  onChangeAction,
}: InvitePlayersProps) {
  const otherUsers = useQuery(api.users.getUsers);

  const selectedUsers = React.useMemo(() => {
    return otherUsers?.filter((user) => value.includes(user._id)) || [];
  }, [otherUsers, value]);

  const options: ComboboxOption[] =
    otherUsers?.map((user) => ({
      value: user._id,
      label: user.name,
    })) || [];

  const handleComboboxSelect = (selectedValue: string | string[]) => {
    const userId = selectedValue as string;
    if (value.includes(userId)) {
      onChangeAction(value.filter((id) => id !== userId));
    } else {
      onChangeAction([...value, userId]);
    }
  };

  const handleRemove = (userId: string) => {
    onChangeAction(value.filter((id) => id !== userId));
  };

  const displayText =
    selectedUsers.length > 0
      ? `${selectedUsers.length} spiller${selectedUsers.length !== 1 ? "e" : ""} valgt`
      : undefined;

  return (
    <>
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
      <p className="text-muted-foreground text-sm">
        Velg spillere for å legge de til i spillet
      </p>
      <div className="space-y-2">
        {selectedUsers.length > 0 && (
          <>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Valgte spillere:
            </h4>
            <div className="flex flex-col gap-4">
              {selectedUsers.map((user) => (
                <div key={user._id}>
                  <div key={user._id} className="flex justify-between">
                    {user.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemove(user._id)}
                    >
                      <XIcon className="h-8 w-8" />
                    </Button>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
