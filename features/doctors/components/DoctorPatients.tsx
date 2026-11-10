"use client"

import { useMemo, useState } from "react"
import { Plus, Search, Trash2, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AddPatientSheet, { type NewPatient } from "./AddPatientSheet"
import type { Doctor, Patient } from "../data"
import { formatDate, getInitials } from "../utils"

type DoctorPatientsProps = {
  doctor: Doctor
  initialPatients: Patient[]
}

const headClass =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase"

const DoctorPatients = ({ doctor, initialPatients }: DoctorPatientsProps) => {
  // TODO: replace local state with API calls (GET/POST/DELETE /doctors/:id/patients)
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [query, setQuery] = useState("")

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    const digits = q.replace(/\D/g, "")
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (digits.length > 0 && p.phone.replace(/\D/g, "").includes(digits))
    )
  }, [patients, query])

  const handleAdd = (data: NewPatient) => {
    setPatients((prev) => [
      {
        ...data,
        id: Date.now(),
        doctorId: doctor.id,
        admittedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
    setIsAddOpen(false)
  }

  const handleDelete = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id))
    setConfirmingId(null)
  }

  return (
    <section className="border bg-card shadow-xs">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            Patients
            <span className="bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
              {patients.length}
            </span>
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
              placeholder="Search by name or phone..."
              aria-label="Search patients by name or phone"
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

      <Table className="text-sm">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className={`h-11 pl-4 ${headClass}`}>Patient</TableHead>
            <TableHead className={headClass}>Age / Gender</TableHead>
            <TableHead className={headClass}>Phone</TableHead>
            <TableHead className={headClass}>Condition</TableHead>
            <TableHead className={headClass}>Admitted</TableHead>
            <TableHead className={`pr-4 text-right ${headClass}`}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center bg-muted text-xs font-semibold">
                      {getInitials(patient.name)}
                    </div>
                    <span className="font-medium">{patient.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.age} yrs · {patient.gender}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {patient.phone}
                </TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatDate(patient.admittedAt)}
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
                          onClick={() => handleDelete(patient.id)}
                        >
                          Delete
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
                        title="Remove patient"
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
                  {patients.length === 0 ? (
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
        doctorName={doctor.name}
        assignedPhones={patients.map((p) => p.phone)}
        onSubmit={handleAdd}
      />
    </section>
  )
}

export default DoctorPatients
