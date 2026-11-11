"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  SearchX,
  Trash2,
  UsersRound,
} from "lucide-react"

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
import { formatDate } from "@/features/doctors/utils"
import { useDoctorListStore } from "@/features/doctors/store"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMessage } from "@/lib/api/errors"
import { getPageWindow } from "@/lib/pagination"
import { directoryConfigs, type DirectoryKind } from "./config"
import { useDirectoryPage } from "./queries"
import type { DirectoryItem } from "./schemas"
import { useDirectoryListStore } from "./store"
import DirectoryDeleteDialog from "./components/DirectoryDeleteDialog"
import DirectoryFormDialog from "./components/DirectoryFormDialog"

const ITEMS_PER_PAGE = 10

const headClass =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase"

/**
 * The hospitals or specializations page: search, list, add, edit, delete.
 * Takes the kind (a string), not the config, so server pages can render it.
 */
const DirectoryPageUI = ({ kind }: { kind: DirectoryKind }) => {
  const config = directoryConfigs[kind]
  const router = useRouter()
  const { search, page, setSearch, setPage, clearSearch } =
    useDirectoryListStore(config.kind)
  const showDoctorsFor = useDoctorListStore((s) => s.showDoctorsFor)

  // Wait for typing to pause; the backend only filters on 2+ characters.
  const debouncedSearch = useDebouncedValue(search.trim(), 300)
  const q = debouncedSearch.length >= 2 ? debouncedSearch : undefined

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useDirectoryPage(config, { q, page, limit: ITEMS_PER_PAGE })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<DirectoryItem | null>(null)
  const [deleting, setDeleting] = useState<DirectoryItem | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const rows = data?.items ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 1
  const start = (page - 1) * ITEMS_PER_PAGE
  const noun = config.singular.toLowerCase()
  const nounPlural = config.plural.toLowerCase()
  const Icon = config.icon

  // A delete can empty the last page: step back to the new last page.
  useEffect(() => {
    if (data && !isPlaceholderData && page > totalPages) setPage(totalPages)
  }, [data, isPlaceholderData, page, totalPages, setPage])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (item: DirectoryItem) => {
    setEditing(item)
    setFormOpen(true)
  }

  const viewDoctors = (item: DirectoryItem) => {
    showDoctorsFor({ [config.doctorFilter]: item.id })
    router.push("/dashboard/doctors")
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {config.plural}
          </h1>
          <p className="text-sm text-muted-foreground">
            {config.pageDescription}
          </p>
        </div>

        <Button size="lg" onClick={openCreate} className="w-full sm:w-auto">
          <Plus />
          Add {config.singular}
        </Button>
      </div>

      <section className="border bg-card shadow-xs">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              {config.singular} Directory
              {!isPending && !isError && (
                <span className="bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                  {total}
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground">
              Sorted A–Z. The doctor count links to a filtered doctor list.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${nounPlural}...`}
              aria-label={`Search ${nounPlural}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Table className="text-sm">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className={`h-11 pl-4 ${headClass}`}>
                <span className="inline-flex items-center gap-2">
                  {config.singular}
                  {isFetching && !isPending && (
                    <Loader2
                      className="size-3.5 animate-spin"
                      aria-label="Updating"
                    />
                  )}
                </span>
              </TableHead>
              <TableHead className={`hidden md:table-cell ${headClass}`}>
                {config.detail.label}
              </TableHead>
              <TableHead className={headClass}>Doctors</TableHead>
              <TableHead className={`hidden lg:table-cell ${headClass}`}>
                Added
              </TableHead>
              <TableHead className={`pr-4 text-right ${headClass}`}>
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
                <TableCell colSpan={5} className="h-48">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="flex size-12 items-center justify-center bg-destructive/10">
                      <AlertCircle className="size-6 text-destructive" />
                    </div>
                    <p className="font-medium">
                      Couldn&apos;t load {nounPlural}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getErrorMessage(error)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                    >
                      Try again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-3 pl-4 whitespace-normal">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">{item.name}</p>
                        {item.detail && (
                          <p className="line-clamp-1 text-xs text-muted-foreground md:hidden">
                            {item.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden max-w-80 whitespace-normal text-muted-foreground md:table-cell">
                    {item.detail ? (
                      <span className="line-clamp-2" title={item.detail}>
                        {item.detail}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell>
                    {item.doctorCount > 0 ? (
                      <button
                        type="button"
                        onClick={() => viewDoctors(item)}
                        title={`View doctors at this ${noun}`}
                        className="inline-flex items-center gap-1.5 tabular-nums hover:text-primary hover:underline"
                      >
                        <UsersRound className="size-3.5 text-muted-foreground" />
                        {item.doctorCount}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                        <UsersRound className="size-3.5" />0
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
                    {formatDate(item.createdAt)}
                  </TableCell>

                  <TableCell className="pr-2 sm:pr-4">
                    <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title={`Edit ${noun}`}
                        aria-label={`Edit ${item.name}`}
                        onClick={() => openEdit(item)}
                        className="text-muted-foreground"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title={`Delete ${noun}`}
                        aria-label={`Delete ${item.name}`}
                        onClick={() => {
                          setDeleting(item)
                          setDeleteOpen(true)
                        }}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-48">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="flex size-12 items-center justify-center bg-muted">
                      {search.trim() ? (
                        <SearchX className="size-6 text-muted-foreground" />
                      ) : (
                        <Icon className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    {search.trim() ? (
                      <>
                        <p className="font-medium">No matching {nounPlural}</p>
                        <p className="text-xs text-muted-foreground">
                          Nothing matches &ldquo;{search.trim()}&rdquo;.{" "}
                          <button
                            type="button"
                            onClick={clearSearch}
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            Clear search
                          </button>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">No {nounPlural} yet</p>
                        <p className="text-xs text-muted-foreground">
                          Add the first {noun} to use it in the doctor form.
                        </p>
                      </>
                    )}
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
            {nounPlural}
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

      <DirectoryFormDialog
        config={config}
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editing}
      />

      <DirectoryDeleteDialog
        config={config}
        open={deleteOpen}
        item={deleting}
        onClose={() => setDeleteOpen(false)}
        onViewDoctors={(item) => {
          setDeleteOpen(false)
          viewDoctors(item)
        }}
      />
    </div>
  )
}

const SkeletonRow = () => (
  <TableRow className="hover:bg-transparent">
    <TableCell className="py-3 pl-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 shrink-0" />
        <Skeleton className="h-4 w-40" />
      </div>
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <Skeleton className="h-3 w-56" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-3 w-8" />
    </TableCell>
    <TableCell className="hidden lg:table-cell">
      <Skeleton className="h-3 w-20" />
    </TableCell>
    <TableCell />
  </TableRow>
)

export default DirectoryPageUI
