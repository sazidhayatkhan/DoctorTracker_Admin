"use client"

import { useState, type FormEvent, type ReactNode } from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  GENDERS,
  patientFormSchema,
  type Gender,
  type PatientFormData,
} from "../schemas"
import { formatAge, todayISO } from "../utils"

export type { PatientFormData }

type FormValues = {
  name: string
  phone: string
  email: string
  birthDate: string
  gender: Gender | null
  address: string
}

export type PatientFormErrors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = {
  name: "",
  phone: "",
  email: "",
  birthDate: "",
  gender: null,
  address: "",
}

const FIELDS = Object.keys(emptyValues) as (keyof FormValues)[]

/** First zod message per field */
const toFieldErrors = (
  issues: { path: PropertyKey[]; message: string }[]
): PatientFormErrors => {
  const errors: PatientFormErrors = {}
  for (const issue of issues) {
    const field = issue.path[0] as keyof FormValues
    if (FIELDS.includes(field)) errors[field] ??= issue.message
  }
  return errors
}

export type PatientFormHelpers = {
  /** Clear the form (handy after create) */
  reset: () => void
  /** Show errors from the server on their fields (e.g. a duplicate phone) */
  setErrors: (errors: PatientFormErrors) => void
}

type PatientFormProps = {
  /** Pre-fill for editing; omit for an empty create form */
  initialValues?: PatientFormData
  /** Called with validated data */
  onSubmit: (data: PatientFormData, helpers: PatientFormHelpers) => void
  /** Rendered above the fields, e.g. a success or error banner */
  header?: ReactNode
  /** Rendered below the fields — put the submit button here */
  footer: ReactNode
  /** Disables every field, e.g. while saving */
  disabled?: boolean
  idPrefix?: string
  className?: string
}

const PatientForm = ({
  initialValues,
  onSubmit,
  header,
  footer,
  disabled = false,
  idPrefix = "patient",
  className,
}: PatientFormProps) => {
  const [values, setValues] = useState<FormValues>(
    initialValues ? { ...initialValues } : emptyValues
  )
  const [errors, setErrors] = useState<PatientFormErrors>({})

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = patientFormSchema.safeParse(values)

    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues))
      return
    }

    setErrors({})
    onSubmit(result.data, {
      reset: () => {
        setValues(emptyValues)
        setErrors({})
      },
      setErrors,
    })
  }

const id = (name: string) => `${idPrefix}-${name}`

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      {header}

      <fieldset disabled={disabled} className="contents">

      <FormSection
        title="Personal information"
        description="Who the patient is."
      >
        <Field
          label="Full name"
          htmlFor={id("name")}
          error={errors.name}
          className="sm:col-span-2"
        >
          <Input
            id={id("name")}
            placeholder="e.g. Karim Uddin"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name || undefined}
          />
        </Field>
        <Field
          label="Date of birth"
          htmlFor={id("birthDate")}
          error={errors.birthDate}
          hint={
            values.birthDate && values.birthDate <= todayISO()
              ? `Age: ${formatAge(values.birthDate)}`
              : undefined
          }
        >
          <Input
            id={id("birthDate")}
            type="date"
            min="1900-01-01"
            max={todayISO()}
            value={values.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
            aria-invalid={!!errors.birthDate || undefined}
          />
        </Field>
        <Field label="Gender" error={errors.gender}>
          <Select
            value={values.gender}
            onValueChange={(v) =>
              set("gender", v as Gender | null)
            }
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={!!errors.gender || undefined}
            >
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FormSection>

      <FormSection
        title="Contact details"
        description="How to reach the patient."
      >
        <Field label="Phone" htmlFor={id("phone")} error={errors.phone}>
          <Input
            id={id("phone")}
            type="tel"
            placeholder="+8801XXXXXXXXX"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone || undefined}
          />
        </Field>
        <Field
          label="Email"
          htmlFor={id("email")}
          error={errors.email}
          hint="Optional"
        >
          <Input
            id={id("email")}
            type="email"
            placeholder="patient@example.com"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email || undefined}
          />
        </Field>
        <Field
          label="Address"
          htmlFor={id("address")}
          error={errors.address}
          className="sm:col-span-2"
        >
          <Input
            id={id("address")}
            placeholder="House, road, area, city"
            value={values.address}
            onChange={(e) => set("address", e.target.value)}
            aria-invalid={!!errors.address || undefined}
          />
        </Field>
      </FormSection>
      </fieldset>

      {footer}
    </form>
  )
}

const FormSection = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) => (
  <section className="grid gap-6 border-b p-5 md:grid-cols-[220px_1fr]">
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </section>
)

const Field = ({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}) => (
  <div className={`space-y-1.5 ${className ?? ""}`}>
    <label htmlFor={htmlFor} className="text-xs font-medium">
      {label}
    </label>
    {children}
    {error ? (
      <p className="text-xs text-destructive">{error}</p>
    ) : hint ? (
      <p className="text-xs text-muted-foreground">{hint}</p>
    ) : null}
  </div>
)

export default PatientForm
