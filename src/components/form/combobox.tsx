import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";

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
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  displayText?: string;
}

export default function Combobox({
  options = [],
  value,
  onChangeAction,
  placeholder = "Velg et alternativ...",
  emptyText = "Ingen alternativer funnet.",
  searchPlaceholder = "Søk...",
  multiple = false,
  className,
  disabled = false,
  displayText,
}: Omit<ComboboxProps, 'onChange'> & { onChangeAction: (value: string | string[]) => void }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const selectedOptions = React.useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return options.filter((option) => value.includes(option.value));
    }
    if (!multiple && typeof value === "string") {
      return options.filter((option) => option.value === value);
    }
    return [];
  }, [options, value, multiple]);

  const handleSelect = (optionValue: string) => {
    onChangeAction(optionValue);
    if (!multiple) {
      setOpen(false);
    }
  };

  const getDisplayText = () => {
    if (displayText) {
      return displayText;
    }
    if (multiple) {
      return placeholder;
    }
    return selectedOptions[0]?.label || placeholder;
  };

  const triggerButton = (
    <Button
      variant="outline"
      aria-expanded={open}
      className={cn(
        "w-[200px]",
        "justify-between",
        className
      )}
      disabled={disabled}
    >
      {getDisplayText()}
      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const commandList = (
    <Command>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const isSelected = multiple
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value;

            return (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => handleSelect(option.value)}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {triggerButton}
        </PopoverTrigger>
        <PopoverContent className={cn("w-[200px]", "p-0")}>
          {commandList}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {triggerButton}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">
          {placeholder || (multiple ? "Velg flere alternativer" : "Velg et alternativ")}
        </DrawerTitle>
        <div className="mt-4 border-t pb-4">
          {commandList}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
