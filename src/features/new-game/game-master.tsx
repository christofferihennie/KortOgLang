import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { useFieldContext } from "./new-game-form"

export function GameMaster({
  label,
  description,
}: {
  label: string
  description: string
}) {
  const field = useFieldContext<boolean>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field className="flex flex-row items-center justify-between rounded-lg shadow-sm">
      <div className="space-y-0.5">
        <FieldLabel htmlFor="form-new-game-gameMaster">{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </div>
      <Switch
        checked={field.state.value}
        onCheckedChange={(value) => field.handleChange(value)}
      />
    </Field>
  )
}
