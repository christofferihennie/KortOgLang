import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | string[]
  onChangeAction: (value: string | string[]) => void
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  multiple?: boolean
  className?: string
  disabled?: boolean
  displayText?: string
}

export function Combobox({
  options = [],
  value,
  onChangeAction,
  placeholder = "Velg et alternativ …",
  emptyText = "Ingen alternativer funnet.",
  searchPlaceholder = "Søk …",
  multiple = false,
  className,
  disabled = false,
  displayText,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const selectedOptions = React.useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return options.filter((option) => value.includes(option.value))
    }
    if (!multiple && typeof value === "string") {
      return options.filter((option) => option.value === value)
    }
    return []
  }, [multiple, options, value])

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : []
      onChangeAction(
        current.includes(optionValue)
          ? current.filter((item) => item !== optionValue)
          : [...current, optionValue]
      )
      return
    }

    onChangeAction(optionValue === value ? "" : optionValue)
    setOpen(false)
  }

  const selectedText = displayText
    ? displayText
    : multiple
      ? placeholder
      : (selectedOptions[0]?.label ?? placeholder)

  const trigger = (
    <Button
      type="button"
      variant="outline"
      aria-expanded={open}
      disabled={disabled}
      className={cn("w-full justify-between", className)}
    >
      {selectedText}
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        strokeWidth={2}
        className="ml-2 size-4 shrink-0 opacity-50"
      />
    </Button>
  )

  const command = (
    <Command>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const selected = multiple
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value

            return (
              <CommandItem
                key={option.value}
                value={option.label}
                data-checked={selected || undefined}
                onSelect={() => handleSelect(option.value)}
              >
                {option.label}
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={trigger} />
        <PopoverContent className="w-[min(24rem,calc(100vw-2rem))] p-0">
          {command}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={trigger} />
      <DrawerContent>
        <DrawerTitle className="sr-only">{placeholder}</DrawerTitle>
        <div className="mt-4 border-t pb-4">{command}</div>
      </DrawerContent>
    </Drawer>
  )
}
