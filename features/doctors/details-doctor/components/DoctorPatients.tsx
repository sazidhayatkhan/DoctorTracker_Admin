"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle, Plus, Search, Trash2, UsersRound, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatAge, formatPatientCode } from "@/features/patients/utils"
import { getErrorMessage } from "@/lib/api/errors"
import { useDoctorPatients, useUnassignPatient } from "../../queries"
import type { Doctor } from "../../schemas"
import { formatDate, getInitials } from "../../utils"
import AddPatientSheet from "./AddPatientSheet"

type DoctorPatientsProps = {
  doctor: Doctor
}

const headClass =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase"

const DoctorPatients = ({ doctor }: DoctorPatientsProps) => {
  const {
    data: assignments = [],
    isPending,
    isError,
    error,
    refetch,
  } = useDoctorPatients(doctor.id)
  const unassign = useUnassignPatient(doctor.id)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  // One doctor's list is small, so search runs locally on the loaded rows.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, "")
    if (!q) return assignments
    const digits = q.replace(/\D/g, "")
    return assignments.filter(
      ({ patient: p }) =>
        p.name.toLowerCase().includes(q) ||
        String(p.patientCode).includes(q) ||
        (digits.length > 0 && p.phone.replace(/\D/g, "").includes(digits))
    )
  }, [assignments, query])

  const handleRemove = (patientId: string) => {
    setConfirmingId(null)
    setRemoveError(null)
    unassign.mutate(patientId, {
      onError: (err) =>
        setRemoveError(`Couldn't remove patient: ${getErrorMessage(err)}`),
    })
  }

  return (
    <section className="border bg-card shadow-xs">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            Patients
            {!isPending && (
              <span className="bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                {assignments.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground">
            Patients currently under the care of {doctor.name}.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, ID or phone..."
              aria-label="Search this doctor's patients"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus />
            Add Patient
          </Button>
        </div>
      </div>

      {removeError && (
        <div
          role="alert"
          className="flex items-center gap-2 border-b border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          <span className="flex-1">{removeError}</span>
          <button
            type="button"
            onClick={() => setRemoveError(null)}
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <Table className="text-sm">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className={`h-11 pl-4 ${headClass}`}>Patient</TableHead>
            <TableHead className={headClass}>Age / Gender</TableHead>
            <TableHead className={headClass}>Phone</TableHead>
            <TableHead className={headClass}>Condition</TableHead>
            <TableHead className={headClass}>Assigned</TableHead>
            <TableHead className={`pr-4 text-right ${headClass}`}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isPending ? (
            Array.from({ length: 3 }, (_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-20" />
                </TableCell>
                <TableCell />
              </TableRow>
            ))
          ) : isError ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="h-48">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <p className="font-medium">Couldn&apos;t load patients</p>
                  <p className="text-xs text-muted-foreground">
                    {getErrorMessage(error)}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Try again
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : filtered.length > 0 ? (
            filtered.map(({ id, patient, condition, notes, assignedAt }) => (
              <TableRow key={id}>
                <TableCell className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center bg-muted text-xs font-semibold">
                      {getInitials(patient.name)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/patients/${patient.id}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {patient.name}
                      </Link>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {formatPatientCode(patient.patientCode)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatAge(patient.birthDate)} · {patient.gender}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {patient.phone}
                </TableCell>
                <TableCell className="max-w-64 whitespace-normal">
                  <p>{condition}</p>
                  {notes && (
                    <p
                      className="line-clamp-2 text-xs whitespace-pre-line text-muted-foreground"
                      title={notes}
                    >
                      {notes}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatDate(assignedAt)}
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-1">
                    {confirmingId === patient.id ? (
                      <>
                        <span className="mr-1 text-xs text-muted-foreground">
                          Remove?
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemove(patient.id)}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmingId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Remove patient from this doctor"
                        aria-label={`Remove ${patient.name}`}
                        onClick={() => setConfirmingId(patient.id)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="h-48">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="flex size-12 items-center justify-center bg-muted">
                    <UsersRound className="size-6 text-muted-foreground" />
                  </div>
                  {assignments.length === 0 ? (
                    <>
                      <p className="font-medium">No patients yet</p>
                      <p className="text-xs text-muted-foreground">
                        Add the first patient for this doctor.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">No matching patients</p>
                      <p className="text-xs text-muted-foreground">
                        Nothing matches &ldquo;{query.trim()}&rdquo;.{" "}
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          Clear search
                        </button>
                      </p>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddPatientSheet
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        doctorId={doctor.id}
        doctorName={doctor.name}
        assignedPatientIds={assignments.map((a) => a.patient.id)}
      />
    </section>
  )
}

export default DoctorPatients
