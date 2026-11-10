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
import HospitalCombobox from "./HospitalCombobox"
import { specializations, type Doctor } from "../data"

/** The editable part of a doctor — shared by create and edit */
export type DoctorFormData = Pick<
  Doctor,
  "name" | "email" | "phone" | "hospital" | "specialization"
>

type FormValues = Omit<DoctorFormData, "specialization"> & {
  specialization: string | null
}

type Errors = Partial<Record<keyof FormValues, string>>

const emptyValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  hospital: "",
  specialization: null,
}

const sameName = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase()

const validate = (v: FormValues, hospitals: string[]): Errors => {
  const errors: Errors = {}
  if (!v.name.trim()) errors.name = "Name is required."
  if (!v.email.trim()) errors.email = "Email is required."
  else if (!/^\S+@\S+\.\S+$/.test(v.email.trim()))
    errors.email = "Enter a valid email address."
  if (!v.phone.trim()) errors.phone = "Phone is required."
  if (!v.specialization) errors.specialization = "Select a specialization."
  if (!v.hospital.trim()) errors.hospital = "Hospital is required."
  else if (!hospitals.some((h) => sameName(h, v.hospital)))
    errors.hospital = "Pick a hospital from the list or add it as new."
  return errors
}

type DoctorFormProps = {
  /** "page" = sectioned two-column layout, "dialog" = compact stacked layout */
  variant?: "page" | "dialog"
  /** Pre-fill for editing; omit for an empty create form */
  initialValues?: DoctorFormData
  /** Hospitals already in the system, used for suggestions */
  hospitals: string[]
  /** Called with validated data. `reset` clears the form (handy after create). */
  onSubmit: (data: DoctorFormData, helpers: { reset: () => void }) => void
  /** Rendered above the fields, e.g. a dialog header or success banner */
  header?: ReactNode
  /** Rendered below the fields — put the submit button here */
  footer: ReactNode
  /** Prefix for input ids, so two forms on one page don't clash */
  idPrefix?: string
  className?: string
}

const DoctorForm = ({
  variant = "page",
  initialValues,
  hospitals: initialHospitals,
  onSubmit,
  header,
  footer,
  idPrefix = "doctor",
  className,
}: DoctorFormProps) => {
  // TODO: load hospitals from API and persist new ones (POST /hospitals)
  const [hospitals, setHospitals] = useState(() =>
    // make sure the doctor's current hospital is always a valid choice
    initialValues?.hospital &&
    !initialHospitals.some((h) => sameName(h, initialValues.hospital))
      ? [...initialHospitals, initialValues.hospital]
      : initialHospitals
  )
  const [values, setValues] = useState<FormValues>(initialValues ?? emptyValues)
  const [errors, setErrors] = useState<Errors>({})

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleAddHospital = (name: string) =>
    setHospitals((prev) =>
      prev.some((h) => sameName(h, name))
        ? prev
        : [...prev, name].sort((a, b) => a.localeCompare(b))
    )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values, hospitals)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit(
      {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        hospital: values.hospital.trim(),
        specialization: values.specialization!,
      },
      {
        reset: () => {
          setValues(emptyValues)
          setErrors({})
        },
      }
    )
  }

  const id = (name: string) => `${idPrefix}-${name}`
  const isDialog = variant === "dialog"

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      {header}

      <div className={isDialog ? "space-y-5 p-4" : undefined}>
        <FormSection
          variant={variant}
          title="Personal information"
          description="Basic contact details for the doctor."
        >
          <Field
            label="Full name"
            htmlFor={id("name")}
            error={errors.name}
            className="sm:col-span-2"
          >
            <Input
              id={id("name")}
              placeholder="e.g. Dr. John Smith"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name || undefined}
            />
          </Field>
          <Field label="Email" htmlFor={id("email")} error={errors.email}>
            <Input
              id={id("email")}
              type="email"
              placeholder="doctor@example.com"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email || undefined}
            />
          </Field>
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
        </FormSection>

        <FormSection
          variant={variant}
          title="Professional details"
          description="Where the doctor practises and their area of expertise."
        >
          <Field
            label="Hospital"
            htmlFor={id("hospital")}
            error={errors.hospital}
            hint={
              isDialog
                ? undefined
                : "Choose an existing hospital, or add a new one if it isn't listed."
            }
          >
            <HospitalCombobox
              id={id("hospital")}
              value={values.hospital}
              onChange={(v) => set("hospital", v)}
              hospitals={hospitals}
              onAddHospital={handleAddHospital}
              invalid={!!errors.hospital}
            />
          </Field>
          <Field label="Specialization" error={errors.specialization}>
            <Select
              value={values.specialization}
              onValueChange={(v) => set("specialization", v as string | null)}
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={!!errors.specialization || undefined}
              >
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FormSection>
      </div>

      {footer}
    </form>
  )
}

const FormSection = ({
  variant,
  title,
  description,
  children,
}: {
  variant: "page" | "dialog"
  title: string
  description: string
  children: ReactNode
}) =>
  variant === "dialog" ? (
    <section className="space-y-3">
      <h3 className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  ) : (
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

export default DoctorForm
