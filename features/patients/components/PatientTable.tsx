"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  UserRoundSearch,
  X,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, getInitials } from "@/features/doctors/utils"
import type { PatientRecord } from "../data"
import { formatAge } from "../utils"

const ITEMS_PER_PAGE = 8

const headClass =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase"

// Column visibility: phone → Patient + Contact; more columns as width grows
const col = {
  contact: "hidden sm:table-cell",
  ageGender: "hidden md:table-cell",
  address: "hidden lg:table-cell",
  created: "hidden md:table-cell",
}

const genderStyles: Record<PatientRecord["gender"], string> = {
  Male: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Female: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  Other: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
}

type PatientTableProps = {
  patients: PatientRecord[]
}

const PatientTable = ({ patients: initialPatients }: PatientTableProps) => {
  // TODO: replace local state with API calls (DELETE /patients/:id)
  const [patients, setPatients] = useState(initialPatients)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  // ISO dates (yyyy-mm-dd) from <input type="date">; "" = no bound
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const hasFilters = !!(query.trim() || fromDate || toDate)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const digits = q.replace(/\D/g, "")
    return patients.filter((p) => {
      // createdAt is yyyy-mm-dd, so string comparison is a date comparison
      const created = p.createdAt.slice(0, 10)
      if (fromDate && created < fromDate) return false
      if (toDate && created > toDate) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (digits.length >= 3 && p.phone.replace(/\D/g, "").includes(digits))
      )
    })
  }, [patients, query, fromDate, toDate])

  const updateFilter = (setter: (v: string) => void) => (value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  const handleDelete = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id))
    setConfirmingId(null)
  }

  const clearFilters = () => {
    setQuery("")
    setFromDate("")
    setToDate("")
    setCurrentPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, totalPages)
  const start = (page - 1) * ITEMS_PER_PAGE
  const rows = filtered.slice(start, start + ITEMS_PER_PAGE)

  return (
    <section className="border bg-card shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b p-3 sm:p-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-sm font-semibold">All Patients</h2>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {patients.length} patients
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by ID, name, phone or email..."
              aria-label="Search patients"
              value={query}
              onChange={(e) => updateFilter(setQuery)(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Created date range */}
          <div className="grid grid-cols-2 gap-2 md:flex md:items-end">
            <DateField
              id="patients-from"
              label="Created from"
              value={fromDate}
              max={toDate || undefined}
              onChange={updateFilter(setFromDate)}
            />
            <DateField
              id="patients-to"
              label="Created to"
              value={toDate}
              min={fromDate || undefined}
              onChange={updateFilter(setToDate)}
            />
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="self-start text-muted-foreground md:self-auto"
            >
              <X />
              Clear
            </Button>
          )}
        </div>
      </div>

      <Table className="text-sm">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className={`h-10 pl-3 sm:pl-4 ${headClass}`}>
              Patient
            </TableHead>
            <TableHead className={`${col.contact} ${headClass}`}>
              Contact
            </TableHead>
            <TableHead className={`${col.ageGender} ${headClass}`}>
              Age / Gender
            </TableHead>
            <TableHead className={`${col.address} ${headClass}`}>
              Address
            </TableHead>
            <TableHead className={`${col.created} ${headClass}`}>
              Created
            </TableHead>
            <TableHead className={`pr-2 text-right sm:pr-4 ${headClass}`}>
              <span className="sr-only sm:not-sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((p) => (
              <TableRow key={p.id}>
                {/* Patient: avatar + name + ID (+ compact meta on small screens) */}
                <TableCell className="py-2.5 pl-3 whitespace-normal sm:pl-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(p.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="leading-tight font-medium">{p.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {p.id}
                        {/* below md: age/gender + created live here */}
                        <span className="font-sans md:hidden">
                          {" · "}
                          {formatAge(p.birthDate)} {p.gender[0]}
                          {" · "}
                          {formatDate(p.createdAt)}
                        </span>
                      </p>
                      {/* below sm: contact lives here */}
                      <p className="mt-0.5 text-xs text-muted-foreground tabular-nums sm:hidden">
                        {p.phone}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Contact: phone + email */}
                <TableCell className={`${col.contact} py-2.5`}>
                  <div className="space-y-0.5 text-xs">
                    <p className="flex items-center gap-1.5 tabular-nums">
                      <Phone className="size-3 text-muted-foreground" />
                      {p.phone}
                    </p>
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="size-3" />
                      {p.email}
                    </p>
                  </div>
                </TableCell>

                {/* Age / Gender */}
                <TableCell className={col.ageGender}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-14 tabular-nums"
                      title={`Born ${formatDate(p.birthDate)}`}
                    >
                      {formatAge(p.birthDate)}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[11px] font-medium ${genderStyles[p.gender]}`}
                    >
                      {p.gender}
                    </span>
                  </div>
                </TableCell>

                {/* Address */}
                <TableCell className={col.address}>
                  <p
                    className="flex max-w-64 items-center gap-1.5 text-xs text-muted-foreground"
                    title={p.address}
                  >
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{p.address}</span>
                  </p>
                </TableCell>

                {/* Created at */}
                <TableCell
                  className={`${col.created} text-xs text-muted-foreground tabular-nums`}
                >
                  {formatDate(p.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="pr-2 sm:pr-4">
                  <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                    {confirmingId === p.id ? (
                      <>
                        <span className="mr-1 hidden text-xs text-muted-foreground sm:inline">
                          Delete?
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
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
                      <>
                        <Link
                          href={`/dashboard/patients/${p.id}`}
                          title="View patient"
                          aria-label={`View ${p.name}`}
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon-sm",
                            className: "text-muted-foreground",
                          })}
                        >
                          <Eye />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Delete patient"
                          aria-label={`Delete ${p.name}`}
                          onClick={() => setConfirmingId(p.id)}
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      </>
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
                    <UserRoundSearch className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium">No patients found</p>
                  <p className="text-xs text-muted-foreground">
                    {hasFilters ? (
                      <>
                        No patients match your search or date range.{" "}
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          Clear filters
                        </button>
                      </>
                    ) : (
                      "Patients will appear here once they're registered."
                    )}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3 border-t px-3 py-2.5 sm:px-4">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filtered.length === 0 ? 0 : start + 1}–
            {Math.min(start + ITEMS_PER_PAGE, filtered.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{filtered.length}</span>
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              variant={page === n ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setCurrentPage(n)}
              aria-current={page === n ? "page" : undefined}
            >
              {n}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  )
}

const DateField = ({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  value: string
  min?: string
  max?: string
  onChange: (value: string) => void
}) => (
  <div className="min-w-0 space-y-1">
    <label
      htmlFor={id}
      className="text-[11px] font-medium text-muted-foreground"
    >
      {label}
    </label>
    <div className="relative">
      <CalendarDays className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 md:w-40"
      />
    </div>
  </div>
)

export default PatientTable
