"use client"

import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Search, UserPlus, X } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { fetchPatients } from "@/features/patients/api"
import type { Patient } from "@/features/patients/schemas"
import { formatAge, formatPatientCode } from "@/features/patients/utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { ApiError, getErrorMessage } from "@/lib/api/errors"
import { patientKeys } from "@/lib/query-keys"
import { useAssignPatient } from "../../queries"
import { getInitials } from "../../utils"

type AddPatientSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctorId: string
  doctorName: string
  /** Patients already under this doctor — shown but not selectable */
  assignedPatientIds: string[]
}

const AddPatientSheet = ({
  open,
  onOpenChange,
  doctorId,
  doctorName,
  assignedPatientIds,
}: AddPatientSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="sm:max-w-md">
      {/* Content unmounts on close, so the form resets every time it opens */}
      <AssignPatientForm
        doctorId={doctorId}
        doctorName={doctorName}
        assignedPatientIds={assignedPatientIds}
        onDone={() => onOpenChange(false)}
      />
    </SheetContent>
  </Sheet>
)

const CREATE_PATIENT_HREF = "/dashboard/patients/create"

/** How many search results the dropdown shows */
const RESULT_LIMIT = 6

type AssignPatientFormProps = Omit<
  AddPatientSheetProps,
  "open" | "onOpenChange"
> & {
  onDone: () => void
}

const AssignPatientForm = ({
  doctorId,
  doctorName,
  assignedPatientIds,
  onDone,
}: AssignPatientFormProps) => {
  const [query, setQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<Patient | null>(null)
  const [condition, setCondition] = useState("")
  const [error, setError] = useState<string | null>(null)

  const assignPatient = useAssignPatient(doctorId)

  // Server-side search (name, patient code, phone, email), after typing pauses.
  const searchTerm = useDebouncedValue(query.trim(), 250)
  const searchParams = { q: searchTerm, page: 1, limit: RESULT_LIMIT }
  const search = useQuery({
    queryKey: patientKeys.list(searchParams),
    queryFn: ({ signal }) => fetchPatients(searchParams, signal),
    enabled: searchTerm.length >= 2,
  })
  const results = useMemo(() => search.data?.items ?? [], [search.data])
  const isSearching =
    query.trim().length >= 2 &&
    (search.isFetching || searchTerm !== query.trim())

  const assigned = useMemo(
    () => new Set(assignedPatientIds),
    [assignedPatientIds]
  )
  const isAssigned = (p: Patient) => assigned.has(p.id)

  const selectPatient = (patient: Patient) => {
    if (isAssigned(patient)) return
    setSelected(patient)
    setQuery("")
    setIsDropdownOpen(false)
    setError(null)
  }

  const clearSelection = () => {
    setSelected(null)
    setCondition("")
    setError(null)
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
    if (!selected) {
      setError("Search and select a patient first.")
      return
    }
    if (!condition.trim()) {
      setError("Please enter the condition or reason for the visit.")
      return
    }

    assignPatient.mutate(
      { patientId: selected.id, condition: condition.trim() },
      {
        onSuccess: onDone,
        onError: (err) =>
          setError(
            err instanceof ApiError && err.status === 409
              ? `${selected.name} is already assigned to ${doctorName}.`
              : getErrorMessage(err)
          ),
      }
    )
  }

  const showDropdown = isDropdownOpen && query.trim().length >= 2

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <SheetHeader className="border-b">
        <SheetTitle>Add Patient</SheetTitle>
        <SheetDescription>
          Assign a registered patient to {doctorName}.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {selected ? (
          /* ── Selected patient + reason ─────────────────────────────── */
          <>
            <div className="space-y-1.5">
              <p className="text-xs font-medium">Patient</p>
              <div className="flex items-center gap-3 border bg-muted/30 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center bg-primary/10 text-sm font-semibold text-primary">
                  {getInitials(selected.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {selected.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground tabular-nums">
                    <span className="font-mono">
                      {formatPatientCode(selected.patientCode)}
                    </span>
                    {" · "}
                    {formatAge(selected.birthDate)} · {selected.gender}
                  </p>
                  <p className="truncate text-xs text-muted-foreground tabular-nums">
                    {selected.phone}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={clearSelection}
                  disabled={assignPatient.isPending}
                  aria-label="Choose a different patient"
                  title="Choose a different patient"
                >
                  <X />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="condition" className="text-xs font-medium">
                Condition / Reason
              </label>
              <Input
                id="condition"
                placeholder="e.g. Hypertension"
                value={condition}
                disabled={assignPatient.isPending}
                onChange={(e) => {
                  setCondition(e.target.value)
                  setError(null)
                }}
                autoFocus
              />
            </div>
          </>
        ) : (
          /* ── Search ────────────────────────────────────────────────── */
          <>
            <div className="space-y-1.5">
              <label htmlFor="patient-search" className="text-xs font-medium">
                Find patient
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
                  autoFocus
                  placeholder="Search by name, phone or patient ID..."
                  className="pr-9 pl-9"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActiveIndex(0)
                    setIsDropdownOpen(true)
                    setError(null)
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setIsDropdownOpen(false)}
                  onKeyDown={handleSearchKeyDown}
                />
                {isSearching && (
                  <Loader2
                    className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                    aria-label="Searching"
                  />
                )}

                {showDropdown && !isSearching && (
                  <div
                    id="patient-search-results"
                    role="listbox"
                    className="absolute inset-x-0 top-full z-10 mt-1 max-h-72 overflow-y-auto border bg-popover p-1 shadow-lg"
                  >
                    {search.isError ? (
                      <p className="px-3 py-4 text-center text-xs text-destructive">
                        {getErrorMessage(search.error)}
                      </p>
                    ) : results.length === 0 ? (
                      <div className="space-y-2 px-3 py-4 text-center">
                        <p className="text-xs text-muted-foreground">
                          No patient matches &ldquo;{query.trim()}&rdquo;.
                        </p>
                        <Link
                          href={CREATE_PATIENT_HREF}
                          onMouseDown={(e) => e.preventDefault()}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline"
                        >
                          <UserPlus className="size-3.5" />
                          Create new patient
                        </Link>
                      </div>
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
                                {formatPatientCode(patient.patientCode)} ·{" "}
                                {patient.phone} · {formatAge(patient.birthDate)}
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
            </div>

            {/* Not registered yet → create page */}
            <div className="flex flex-col items-center gap-3 border border-dashed px-4 py-6 text-center">
              <div className="flex size-10 items-center justify-center bg-muted">
                <UserPlus className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Patient not registered yet?
                </p>
                <p className="text-xs text-muted-foreground">
                  Create the patient first, then come back to assign them to{" "}
                  {doctorName}.
                </p>
              </div>
              <Link
                href={CREATE_PATIENT_HREF}
                className={buttonVariants({ variant: "outline" })}
              >
                <UserPlus />
                Create new patient
              </Link>
            </div>
          </>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <SheetFooter className="flex-row justify-end border-t">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={!selected || assignPatient.isPending}>
          {assignPatient.isPending && <Loader2 className="animate-spin" />}
          Assign Patient
        </Button>
      </SheetFooter>
    </form>
  )
}

export default AddPatientSheet
