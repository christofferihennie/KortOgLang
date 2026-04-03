import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFieldContext } from "./new-game-form"

export function SetLocation({
  label,
  description,
  items,
}: {
  label: string
  description: string
  items: { label: string; value: string }[]
}) {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field orientation="responsive" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor="form-new-game-location">{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value ?? "")}
      >
        <SelectTrigger
          id="form-tanstack-select-language"
          aria-invalid={isInvalid}
          className="min-w-30"
        >
          <SelectValue placeholder="Velg sted">
            {(value) =>
              items.find((item) => item.value === value)?.label ??
              (value ? String(value) : "Velg sted")
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="center">
          {items.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
