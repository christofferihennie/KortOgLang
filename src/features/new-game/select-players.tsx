import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import React from "react"
import { useFieldContext } from "./new-game-form"

type PlayerOption = { value: string; label: string }

export function SelectPlayers({
  label,
  description,
  items,
}: {
  label: string
  description: string
  items?: PlayerOption[]
}) {
  const field = useFieldContext<string[]>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const anchor = useComboboxAnchor()
  const selectedItems = (items ?? []).filter((item) =>
    field.state.value.includes(item.value)
  )

  return (
    <Field orientation="responsive" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor="form-new-game-players">{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
      <Combobox<PlayerOption, true>
        items={items}
        value={selectedItems}
        onValueChange={(value: PlayerOption[]) =>
          field.handleChange((value ?? []).map((item) => item.value))
        }
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
        isItemEqualToValue={(item, value) => item.value === value.value}
        autoHighlight
        multiple
        disabled={!items}
      >
        <ComboboxChips ref={anchor} className="w-full max-w-xs">
          <ComboboxValue>
            {(values: PlayerOption[]) => (
              <React.Fragment>
                {values.map((item) => (
                  <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
                ))}
                <ComboboxChipsInput />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>Ingen spillere funnet.</ComboboxEmpty>
          <ComboboxList>
            {(item: PlayerOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
