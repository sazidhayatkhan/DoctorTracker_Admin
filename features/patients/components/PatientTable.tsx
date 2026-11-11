"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, getInitials } from "@/features/doctors/utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMessage } from "@/lib/api/errors"
import {
  useDeletePatient,
  usePatients,
  usePrefetchPatient,
} from "../queries"
import type { Gender } from "../schemas"
import { usePatientListStore } from "../store"
import { formatAge, formatPatientCode } from "../utils"

const ITEMS_PER_PAGE = 8

/** Most page-number buttons shown at once */
const PAGE_WINDOW = 5

const headClass =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase"

// Column visibility: phone → Patient + Contact; more columns as width grows
const col = {
  contact: "hidden sm:table-cell",
  ageGender: "hidden md:table-cell",
  address: "hidden lg:table-cell",
  created: "hidden md:table-cell",
}

const genderStyles: Record<Gender, string> = {
  Male: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Female: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  Other: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
}

/** Up to PAGE_WINDOW page numbers centred on the current page */
const getPageWindow = (page: number, totalPages: number) => {
  const size = Math.min(PAGE_WINDOW, totalPages)
  const start = Math.min(
    Math.max(1, page - Math.floor(size / 2)),
    totalPages - size + 1
  )
  return Array.from({ length: size }, (_, i) => start + i)
}

const PatientTable = () => {
  const { search, from, to, page, setSearch, setFrom, setTo, setPage, clearFilters } =
    usePatientListStore()

  // Wait for typing to pause before querying the server.
  const debouncedSearch = useDebouncedValue(search.trim(), 300)

  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } =
    usePatients({
      q: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      limit: ITEMS_PER_PAGE,
    })

  const deletePatient = useDeletePatient()
  const prefetchPatient = usePrefetchPatient()
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const rows = data?.items ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 1
  const start = (page - 1) * ITEMS_PER_PAGE
  const hasFilters = !!(search.trim() || from || to)

  // A delete can empty the last page: step back to the new last page.
  useEffect(() => {
    if (data && !isPlaceholderData && page > totalPages) setPage(totalPages)
  }, [data, isPlaceholderData, page, totalPages, setPage])

  const handleDelete = (id: string) => {
    setConfirmingId(null)
    setDeleteError(null)
    deletePatient.mutate(id, {
      onError: (err) =>
        setDeleteError(`Couldn't delete patient: ${getErrorMessage(err)}`),
    })
  }

  return (
    <section className="border bg-card shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b p-3 sm:p-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            All Patients
            {isFetching && !isPending && (
              <Loader2
                className="size-3.5 animate-spin text-muted-foreground"
                aria-label="Updating"
              />
            )}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isPending
              ? "Loading patients…"
              : `${total}${hasFilters ? " matching" : ""} patient${total === 1 ? "" : "s"}`}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Created date range */}
          <div className="grid grid-cols-2 gap-2 md:flex md:items-end">
            <DateField
              id="patients-from"
              label="Created from"
              value={from}
              max={to || undefined}
              onChange={setFrom}
            />
            <DateField
              id="patients-to"
              label="Created to"
              value={to}
              min={from || undefined}
              onChange={setTo}
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

      {deleteError && (
        <div
          role="alert"
          className="flex items-center gap-2 border-b border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          <span className="flex-1">{deleteError}</span>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

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

        <TableBody
          className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}
        >
          {isPending ? (
            Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)
          ) : isError ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="h-48">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="flex size-12 items-center justify-center bg-destructive/10">
                    <AlertCircle className="size-6 text-destructive" />
                  </div>
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
          ) : rows.length > 0 ? (
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
                        {formatPatientCode(p.patientCode)}
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
                    {p.email && (
                      <p className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="size-3" />
                        {p.email}
                      </p>
                    )}
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
                          onMouseEnter={() => prefetchPatient(p.id)}
                          onFocus={() => prefetchPatient(p.id)}
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
            {rows.length === 0 ? 0 : start + 1}–{start + rows.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{total}</span>
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {getPageWindow(page, totalPages).map((n) => (
            <Button
              key={n}
              variant={page === n ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setPage(n)}
              aria-current={page === n ? "page" : undefined}
            >
              {n}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page >= totalPages}
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

const SkeletonRow = () => (
  <TableRow className="hover:bg-transparent">
    <TableCell className="py-2.5 pl-3 sm:pl-4">
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-8 shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </TableCell>
    <TableCell className={col.contact}>
      <Skeleton className="h-3 w-28" />
    </TableCell>
    <TableCell className={col.ageGender}>
      <Skeleton className="h-3 w-20" />
    </TableCell>
    <TableCell className={col.address}>
      <Skeleton className="h-3 w-40" />
    </TableCell>
    <TableCell className={col.created}>
      <Skeleton className="h-3 w-20" />
    </TableCell>
    <TableCell />
  </TableRow>
)

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
