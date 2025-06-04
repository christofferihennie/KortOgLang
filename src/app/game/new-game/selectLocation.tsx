"use client";

import { api } from "#/_generated/api";
import { Combobox, ComboboxOption } from "@/components/form";
import { useQuery } from "convex/react";

interface SelectLocationProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SelectLocation({
  value = "",
  onChange,
}: SelectLocationProps) {
  const locations = useQuery(api.locations.getLocations);

  const options: ComboboxOption[] = locations?.map((location) => ({
    value: location._id,
    label: location.name,
  })) || [];

  const handleComboboxSelect = (selectedValue: string | string[]) => {
    const locationId = selectedValue as string;
    onChange(locationId === value ? "" : locationId);
  };

  return (
    <Combobox
      options={options}
      value={value}
      onChangeAction={handleComboboxSelect}
      placeholder="Vel en lokasjon..."
      emptyText="Ingen lokasjoner funnet."
      searchPlaceholder="Search framework..."
    />
  );
}
