import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "@tanstack/react-form-start"
import z from "zod"

const newGameSchema = z.object({
  players: z.array(z.string()).min(2, "Må være minst to spillere"),
  location: z.string().min(1, "Venligst velg et sted"),
  gameMaster: z.boolean(),
})

export function NewGameForm() {
  const form = useForm({
    defaultValues: {
      players: [] as Array<string>,
      location: "",
      gameMaster: false,
    },
    validators: {
      onSubmit: newGameSchema,
    },
    onSubmit: async (v) => {
      console.log(v)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="location"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="responsive" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-tanstack-select-language">
                    Spoken Language
                  </FieldLabel>
                  <FieldDescription>
                    For best results, select the language you speak.
                  </FieldDescription>
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
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent align="center">
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )
          }}
        />
      </FieldGroup>
    </form>
  )
}
