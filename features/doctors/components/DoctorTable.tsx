"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Phone,
  Trash2,
  UserRoundSearch,
  UsersRound,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMessage } from "@/lib/api/errors"
import { getPageWindow } from "@/lib/pagination"
import { useDeleteDoctor, useDoctors, usePrefetchDoctor } from "../queries"
import { useDoctorListStore } from "../store"
import { formatDate, getInitials, specializationClass } from "../utils"

const ITEMS_PER_PAGE = 5

const headClass =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase"

// Column visibility: phone → Doctor + Actions only; more columns as width grows
const col = {
  phone: "hidden lg:table-cell",
  hospital: "hidden md:table-cell",
  specialization: "hidden md:table-cell",
  patients: "hidden sm:table-cell",
  joined: "hidden xl:table-cell",
}

const DoctorTable = () => {
  const {
    search,
    specializationId,
    hospitalId,
    from,
    to,
    page,
    setPage,
    clearFilters,
  } = useDoctorListStore()

  // Wait for typing to pause before querying the server.
  const debouncedSearch = useDebouncedValue(search.trim(), 300)

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useDoctors({
    q: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    specializationId: specializationId || undefined,
    hospitalId: hospitalId || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  })

  const deleteDoctor = useDeleteDoctor()
  const prefetchDoctor = usePrefetchDoctor()
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const rows = data?.items ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 1
  const start = (page - 1) * ITEMS_PER_PAGE
  const hasFilters = !!(
    search.trim() ||
    specializationId ||
    hospitalId ||
    from ||
    to
  )

  // A delete can empty the last page: step back to the new last page.
  useEffect(() => {
    if (data && !isPlaceholderData && page > totalPages) setPage(totalPages)
  }, [data, isPlaceholderData, page, totalPages, setPage])

  const handleDelete = (id: string) => {
    setConfirmingId(null)
    setDeleteError(null)
    deleteDoctor.mutate(id, {
      onError: (err) =>
        setDeleteError(`Couldn't delete doctor: ${getErrorMessage(err)}`),
    })
  }

  return (
    <div>
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
            <TableHead className={`h-10 pl-3 sm:h-11 sm:pl-4 ${headClass}`}>
              <span className="inline-flex items-center gap-2">
                Doctor
                {isFetching && !isPending && (
                  <Loader2
                    className="size-3.5 animate-spin"
                    aria-label="Updating"
                  />
                )}
              </span>
            </TableHead>
            <TableHead className={`${col.phone} ${headClass}`}>Phone</TableHead>
            <TableHead className={`${col.hospital} ${headClass}`}>
              Hospital
            </TableHead>
            <TableHead className={`${col.specialization} ${headClass}`}>
              Specialization
            </TableHead>
            <TableHead className={`${col.patients} ${headClass}`}>
              Patients
            </TableHead>
            <TableHead className={`${col.joined} ${headClass}`}>
              Joined
            </TableHead>
            <TableHead className={`pr-3 text-right sm:pr-4 ${headClass}`}>
              <span className="sr-only sm:not-sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody
          className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}
        >
          {isPending ? (
            Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
              <SkeletonRow key={i} />
            ))
          ) : isError ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="h-48">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="flex size-12 items-center justify-center bg-destructive/10">
                    <AlertCircle className="size-6 text-destructive" />
                  </div>
                  <p className="font-medium">Couldn&apos;t load doctors</p>
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
            rows.map((doctor) => {
              const href = `/dashboard/doctors/${doctor.id}`
              const specialization = doctor.specialization?.name ?? "—"
              const hospital = doctor.hospital?.name ?? "—"
              const patientCount = doctor.patientCount ?? 0

              return (
                <TableRow key={doctor.id} className="group">
                  <TableCell className="py-2.5 pl-3 whitespace-normal sm:py-3 sm:pl-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center bg-primary/10 text-xs font-semibold text-primary sm:size-9">
                        {getInitials(doctor.name)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={href}
                          onMouseEnter={() => prefetchDoctor(doctor.id)}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {doctor.name}
                        </Link>
                        {/* md+: email; below md: compact summary of hidden columns */}
                        <p className="hidden text-xs text-muted-foreground md:block">
                          {doctor.email}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground md:hidden">
                          <span
                            className={`mr-1.5 inline-block px-1.5 py-px text-[10px] font-medium ${specializationClass(
                              doctor.specialization?.name
                            )}`}
                          >
                            {specialization}
                          </span>
                          {hospital}
                          <span className="sm:hidden">
                            {" · "}
                            {patientCount} patients
                          </span>
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className={col.phone}>
                    <span className="inline-flex items-center gap-2 text-muted-foreground tabular-nums">
                      <Phone className="size-3.5" />
                      {doctor.phone}
                    </span>
                  </TableCell>

                  <TableCell className={col.hospital}>
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="size-3.5 text-muted-foreground" />
                      {hospital}
                    </span>
                  </TableCell>

                  <TableCell className={col.specialization}>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${specializationClass(
                        doctor.specialization?.name
                      )}`}
                    >
                      {specialization}
                    </span>
                  </TableCell>

                  <TableCell className={col.patients}>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 tabular-nums hover:text-primary hover:underline"
                    >
                      <UsersRound className="size-3.5 text-muted-foreground" />
                      {patientCount}
                    </Link>
                  </TableCell>

                  <TableCell
                    className={`${col.joined} text-muted-foreground tabular-nums`}
                  >
                    {formatDate(doctor.createdAt)}
                  </TableCell>

                  <TableCell className="pr-2 sm:pr-4">
                    <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                      {confirmingId === doctor.id ? (
                        <>
                          <span className="mr-1 hidden text-xs text-muted-foreground sm:inline">
                            Delete?
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(doctor.id)}
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
                            href={href}
                            title="View doctor & patients"
                            aria-label={`View ${doctor.name}`}
                            onMouseEnter={() => prefetchDoctor(doctor.id)}
                            onFocus={() => prefetchDoctor(doctor.id)}
                            className="inline-flex size-7 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Eye className="size-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Delete doctor"
                            aria-label={`Delete ${doctor.name}`}
                            onClick={() => setConfirmingId(doctor.id)}
                            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="h-48">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="flex size-12 items-center justify-center bg-muted">
                    <UserRoundSearch className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium">No doctors found</p>
                  <p className="text-xs text-muted-foreground">
                    {hasFilters ? (
                      <>
                        Try adjusting your search or filters.{" "}
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          Clear filters
                        </button>
                      </>
                    ) : (
                      "Doctors will appear here once they're added."
                    )}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3 border-t px-3 py-2.5 sm:px-4 sm:py-3">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {rows.length === 0 ? 0 : start + 1}–{start + rows.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{total}</span>{" "}
          doctors
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
    </div>
  )
}

const SkeletonRow = () => (
  <TableRow className="hover:bg-transparent">
    <TableCell className="py-3 pl-3 sm:pl-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
    </TableCell>
    <TableCell className={col.phone}>
      <Skeleton className="h-3 w-28" />
    </TableCell>
    <TableCell className={col.hospital}>
      <Skeleton className="h-3 w-28" />
    </TableCell>
    <TableCell className={col.specialization}>
      <Skeleton className="h-5 w-24" />
    </TableCell>
    <TableCell className={col.patients}>
      <Skeleton className="h-3 w-6" />
    </TableCell>
    <TableCell className={col.joined}>
      <Skeleton className="h-3 w-20" />
    </TableCell>
    <TableCell />
  </TableRow>
)

export default DoctorTable
