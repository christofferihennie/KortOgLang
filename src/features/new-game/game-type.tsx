import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { GameType as GameTypeValue } from "shared/game"
import { useFieldContext } from "./new-game-form"

export function GameType({
  label,
  description,
  options,
}: {
  label: string
  description: string
  options: Array<{
    label: string
    value: GameTypeValue
    description: string
  }>
}) {
  const field = useFieldContext<GameTypeValue>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet>
      <FieldLegend className="text-sm!">{label}</FieldLegend>
      <FieldDescription>{description}</FieldDescription>
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
      >
        {options.map((opt) => (
          <FieldLabel
            key={opt.value}
            htmlFor={`form-new-game-radiogroup-${opt.value}`}
          >
            <Field orientation="horizontal" data-invalid={isInvalid}>
              <FieldContent>
                <FieldTitle>{opt.label}</FieldTitle>
                <FieldDescription>{opt.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={opt.value}
                id={`form-new-game-radiogroup-${opt.value}`}
                aria-invalid={isInvalid}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  )
}
