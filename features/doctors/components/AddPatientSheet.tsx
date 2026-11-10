"use client"

import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react"
import { Search, UserCheck, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { genders, patients as patientDatabase, type Patient } from "../data"
import { getInitials } from "../utils"

export type NewPatient = Pick<
  Patient,
  "name" | "age" | "gender" | "phone" | "condition"
>

type AddPatientSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctorName: string
  /** Phones of patients already under this doctor — shown but not selectable */
  assignedPhones: string[]
  onSubmit: (patient: NewPatient) => void
}

const AddPatientSheet = ({
  open,
  onOpenChange,
  doctorName,
  assignedPhones,
  onSubmit,
}: AddPatientSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="sm:max-w-md">
      {/* Content unmounts on close, so the form resets every time it opens */}
      <AddPatientForm
        doctorName={doctorName}
        assignedPhones={assignedPhones}
        onSubmit={onSubmit}
        onCancel={() => onOpenChange(false)}
      />
    </SheetContent>
  </Sheet>
)

// ---------------------------------------------------------------------------

type FormValues = {
  name: string
  age: string
  gender: Patient["gender"] | null
  phone: string
  condition: string
}

const emptyValues: FormValues = {
  name: "",
  age: "",
  gender: null,
  phone: "",
  condition: "",
}

const normalizePhone = (phone: string) => phone.replace(/[^\d]/g, "")

// TODO: replace with an API search (GET /patients?q=...)
const searchPatients = (query: string): Patient[] => {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const digits = normalizePhone(q)

  const seen = new Set<string>()
  return patientDatabase
    .filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q)
      const phoneMatch =
        digits.length >= 3 && normalizePhone(p.phone).includes(digits)
      return nameMatch || phoneMatch
    })
    .filter((p) => {
      // Same person may be under several doctors — show once (keyed by phone)
      const key = normalizePhone(p.phone)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 6)
}

type AddPatientFormProps = Omit<
  AddPatientSheetProps,
  "open" | "onOpenChange"
> & {
  onCancel: () => void
}

const AddPatientForm = ({
  doctorName,
  assignedPhones,
  onSubmit,
  onCancel,
}: AddPatientFormProps) => {
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<Patient | null>(null)

  const assigned = useMemo(
    () => new Set(assignedPhones.map(normalizePhone)),
    [assignedPhones]
  )
  const results = useMemo(() => searchPatients(query), [query])
  const isAssigned = (p: Patient) => assigned.has(normalizePhone(p.phone))

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const selectPatient = (patient: Patient) => {
    if (isAssigned(patient)) return
    setSelected(patient)
    setValues({
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
      phone: patient.phone,
      condition: "", // reason for this visit is doctor-specific
    })
    setQuery("")
    setIsDropdownOpen(false)
    setError(null)
  }

  const clearSelection = () => {
    setSelected(null)
    setValues(emptyValues)
  }

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || results.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      selectPatient(results[activeIndex])
    } else if (event.key === "Escape") {
      event.stopPropagation() // close dropdown, not the drawer
      setIsDropdownOpen(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = values.name.trim()
    const phone = values.phone.trim()
    const condition = values.condition.trim()
    const age = Number(values.age)

    if (!name || !phone || !condition || !values.gender || !age) {
      setError("Please fill in all fields.")
      return
    }
    if (assigned.has(normalizePhone(phone))) {
      setError("This patient is already under this doctor.")
      return
    }

    onSubmit({ name, age, gender: values.gender, phone, condition })
  }

  const showDropdown = isDropdownOpen && query.trim().length >= 2

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader className="border-b">
        <SheetTitle>Add Patient</SheetTitle>
        <SheetDescription>
          Register a patient under {doctorName}.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Existing patient lookup */}
        <div className="space-y-1.5">
          <label htmlFor="patient-search" className="text-xs font-medium">
            Find existing patient
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="patient-search"
              role="combobox"
              aria-expanded={showDropdown}
              aria-controls="patient-search-results"
              aria-autocomplete="list"
              autoComplete="off"
              placeholder="Search by name or phone number..."
              className="pl-9"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(0)
                setIsDropdownOpen(true)
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setIsDropdownOpen(false)}
              onKeyDown={handleSearchKeyDown}
            />

            {showDropdown && (
              <div
                id="patient-search-results"
                role="listbox"
                className="absolute inset-x-0 top-full z-10 mt-1 max-h-72 overflow-y-auto border bg-popover p-1 shadow-lg"
              >
                {results.length === 0 ? (
                  <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No matching patients. Fill in the form below to add a new
                    one.
                  </p>
                ) : (
                  results.map((patient, index) => {
                    const disabled = isAssigned(patient)
                    return (
                      <button
                        key={patient.id}
                        type="button"
                        role="option"
                        aria-selected={index === activeIndex}
                        aria-disabled={disabled}
                        // keep focus in the input so onBlur doesn't close first
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectPatient(patient)}
                        className={`flex w-full items-center gap-3 px-2 py-2 text-left ${
                          index === activeIndex ? "bg-muted" : ""
                        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center bg-primary/10 text-xs font-semibold text-primary">
                          {getInitials(patient.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {patient.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground tabular-nums">
                            {patient.phone} · {patient.age} yrs ·{" "}
                            {patient.gender}
                          </p>
                        </div>
                        {disabled && (
                          <span className="shrink-0 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Already added
                          </span>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {selected && (
            <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
              <UserCheck className="size-4 shrink-0" />
              <span className="flex-1">
                Using existing record for <strong>{selected.name}</strong>
              </span>
              <button
                type="button"
                onClick={clearSelection}
                aria-label="Clear selected patient"
                className="p-0.5 hover:bg-emerald-500/20"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          {selected ? "Patient details" : "or add a new patient"}
          <div className="h-px flex-1 bg-border" />
        </div>

        <Field label="Full name" htmlFor="name">
          <Input
            id="name"
            placeholder="e.g. Karim Uddin"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            readOnly={!!selected}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Age" htmlFor="age">
            <Input
              id="age"
              type="number"
              min={0}
              max={130}
              value={values.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </Field>
          <Field label="Gender">
            <Select
              value={values.gender}
              onValueChange={(value) =>
                set("gender", value as Patient["gender"] | null)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Phone" htmlFor="phone">
          <Input
            id="phone"
            type="tel"
            placeholder="+8801XXXXXXXXX"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            readOnly={!!selected}
          />
        </Field>

        <Field label="Condition / Reason" htmlFor="condition">
          <Input
            id="condition"
            placeholder="e.g. Hypertension"
            value={values.condition}
            onChange={(e) => set("condition", e.target.value)}
            autoFocus={!!selected}
          />
        </Field>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <SheetFooter className="flex-row justify-end border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Patient</Button>
      </SheetFooter>
    </form>
  )
}

const Field = ({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="text-xs font-medium">
      {label}
    </label>
    {children}
  </div>
)

export default AddPatientSheet
