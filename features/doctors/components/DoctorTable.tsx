"use client"

import { useState } from "react"
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Phone,
  Trash2,
  UserRoundSearch,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { specializationStyles, type Doctor } from "../data"

const ITEMS_PER_PAGE = 5

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

const getInitials = (name: string) =>
  name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

type DoctorTableProps = {
  doctors: Doctor[]
}

const DoctorTable = ({ doctors }: DoctorTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(doctors.length / ITEMS_PER_PAGE))
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedDoctors = doctors.slice(start, start + ITEMS_PER_PAGE)

  return (
    <div>
      <Table className="text-sm">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 pl-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Doctor
            </TableHead>
            <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Phone
            </TableHead>
            <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Hospital
            </TableHead>
            <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Specialization
            </TableHead>
            <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Joined
            </TableHead>
            <TableHead className="pr-4 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedDoctors.length > 0 ? (
            paginatedDoctors.map((doctor) => (
              <TableRow key={doctor.id} className="group">
                <TableCell className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(doctor.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doctor.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-2 text-muted-foreground tabular-nums">
                    <Phone className="size-3.5" />
                    {doctor.phone}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    {doctor.hospital}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${
                      specializationStyles[doctor.specialization] ??
                      "bg-primary/10 text-primary"
                    }`}
                  >
                    {doctor.specialization}
                  </span>
                </TableCell>

                <TableCell className="text-muted-foreground tabular-nums">
                  {formatDate(doctor.createdAt)}
                </TableCell>

                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="View doctor"
                      aria-label={`View ${doctor.name}`}
                      className="text-muted-foreground"
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Edit doctor"
                      aria-label={`Edit ${doctor.name}`}
                      className="text-muted-foreground"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Delete doctor"
                      aria-label={`Delete ${doctor.name}`}
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
              <TableCell colSpan={6} className="h-48">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="flex size-12 items-center justify-center bg-muted">
                    <UserRoundSearch className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium">No doctors found</p>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {doctors.length === 0 ? 0 : start + 1}–
            {Math.min(start + ITEMS_PER_PAGE, doctors.length)}
          </span>{" "}
          of <span className="font-medium text-foreground">{doctors.length}</span>{" "}
          doctors
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setCurrentPage(page)}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DoctorTable
