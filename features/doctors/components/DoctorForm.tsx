"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { Building2, Stethoscope } from "lucide-react"

import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/api/errors"
import {
  useCreateHospital,
  useCreateSpecialization,
  useHospitalOptions,
  useSpecializationOptions,
} from "../queries"
import {
  doctorFormSchema,
  type DoctorFormValues,
  type DoctorPayload,
  type LookupOption,
} from "../schemas"
import LookupCombobox, { normalizeName } from "./LookupCombobox"

export type DoctorFormErrors = Partial<Record<keyof DoctorFormValues, string>>

export type DoctorFormHelpers = {
  /** Clear the form (handy after create) */
  reset: () => void
  /** Show errors from the server on their fields (e.g. a duplicate email) */
  setErrors: (errors: DoctorFormErrors) => void
}

const emptyValues: DoctorFormValues = {
  name: "",
  email: "",
  phone: "",
  hospital: "",
  specialization: "",
}

const FIELDS = Object.keys(emptyValues) as (keyof DoctorFormValues)[]

const findByName = (options: LookupOption[] | undefined, name: string) =>
  options?.find((o) => normalizeName(o.name) === normalizeName(name))

type DoctorFormProps = {
  /** "page" = sectioned two-column layout, "dialog" = compact stacked layout */
  variant?: "page" | "dialog"
  /** Pre-fill for editing; omit for an empty create form */
  initialValues?: DoctorFormValues
  /** Called with validated data, hospital/specialization resolved to IDs */
  onSubmit: (data: DoctorPayload, helpers: DoctorFormHelpers) => void
  /** Rendered above the fields, e.g. a dialog header or success banner */
  header?: ReactNode
  /** Rendered below the fields — put the submit button here */
  footer: ReactNode
  /** Disables every field, e.g. while saving */
  disabled?: boolean
  /** Prefix for input ids, so two forms on one page don't clash */
  idPrefix?: string
  className?: string
}

const DoctorForm = ({
  variant = "page",
  initialValues,
  onSubmit,
  header,
  footer,
  disabled = false,
  idPrefix = "doctor",
  className,
}: DoctorFormProps) => {
  const hospitals = useHospitalOptions()
  const specializations = useSpecializationOptions()
  const createHospital = useCreateHospital()
  const createSpecialization = useCreateSpecialization()

  const [values, setValues] = useState<DoctorFormValues>(
    initialValues ?? emptyValues
  )
  const [errors, setErrors] = useState<DoctorFormErrors>({})

  const set = <K extends keyof DoctorFormValues>(
    key: K,
    value: DoctorFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = doctorFormSchema.safeParse(values)

    const nextErrors: DoctorFormErrors = {}
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof DoctorFormValues
        if (FIELDS.includes(field)) nextErrors[field] ??= issue.message
      }
    }

    // Names must match an existing (or just-added) hospital / specialization.
    const hospital = findByName(hospitals.data, values.hospital)
    const specialization = findByName(
      specializations.data,
      values.specialization
    )

    if (!nextErrors.hospital && !hospital) {
      nextErrors.hospital = hospitals.isPending
        ? "Hospitals are still loading — try again in a moment."
        : "Pick a hospital from the list or add it as new."
    }
    if (!nextErrors.specialization && !specialization) {
      nextErrors.specialization = specializations.isPending
        ? "Specializations are still loading — try again in a moment."
        : "Pick a specialization from the list or add it as new."
    }

    setErrors(nextErrors)
    if (!result.success || !hospital || !specialization) return

    onSubmit(
      {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        hospitalId: hospital.id,
        specializationId: specialization.id,
      },
      {
        reset: () => {
          setValues(emptyValues)
          setErrors({})
        },
        setErrors,
      }
    )
  }

  const id = (name: string) => `${idPrefix}-${name}`
  const isDialog = variant === "dialog"

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      {header}

      <fieldset disabled={disabled} className="contents">
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
              <LookupCombobox
                id={id("hospital")}
                entityLabel="hospital"
                icon={Building2}
                value={values.hospital}
                onChange={(v) => set("hospital", v)}
                options={hospitals.data ?? []}
                isLoading={hospitals.isPending}
                isCreating={createHospital.isPending}
                onCreate={(name) =>
                  createHospital.mutate(name, {
                    onError: (err) =>
                      setErrors((prev) => ({
                        ...prev,
                        hospital: getErrorMessage(err),
                      })),
                  })
                }
                invalid={!!errors.hospital}
              />
            </Field>
            <Field
              label="Specialization"
              htmlFor={id("specialization")}
              error={errors.specialization}
            >
              <LookupCombobox
                id={id("specialization")}
                entityLabel="specialization"
                icon={Stethoscope}
                value={values.specialization}
                onChange={(v) => set("specialization", v)}
                options={specializations.data ?? []}
                isLoading={specializations.isPending}
                isCreating={createSpecialization.isPending}
                onCreate={(name) =>
                  createSpecialization.mutate(name, {
                    onError: (err) =>
                      setErrors((prev) => ({
                        ...prev,
                        specialization: getErrorMessage(err),
                      })),
                  })
                }
                invalid={!!errors.specialization}
              />
            </Field>
          </FormSection>
        </div>
      </fieldset>

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
