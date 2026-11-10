"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  Trash2,
  UserRoundSearch,
  UsersRound,
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
import { patients, specializationStyles, type Doctor } from "../data"
import { formatDate, getInitials } from "../utils"

const patientCount = (doctorId: number) =>
  patients.filter((p) => p.doctorId === doctorId).length

const ITEMS_PER_PAGE = 5

type DoctorTableProps = {
  doctors: Doctor[]
}

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
            <TableHead className={`h-10 pl-3 sm:h-11 sm:pl-4 ${headClass}`}>
              Doctor
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

        <TableBody>
          {paginatedDoctors.length > 0 ? (
            paginatedDoctors.map((doctor) => (
              <TableRow key={doctor.id} className="group">
                <TableCell className="py-2.5 pl-3 whitespace-normal sm:py-3 sm:pl-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center bg-primary/10 text-xs font-semibold text-primary sm:size-9">
                      {getInitials(doctor.name)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/doctors/${doctor.id}`}
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
                          className={`mr-1.5 inline-block px-1.5 py-px text-[10px] font-medium ${
                            specializationStyles[doctor.specialization] ??
                            "bg-primary/10 text-primary"
                          }`}
                        >
                          {doctor.specialization}
                        </span>
                        {doctor.hospital}
                        <span className="sm:hidden">
                          {" · "}
                          {patientCount(doctor.id)} patients
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
                    {doctor.hospital}
                  </span>
                </TableCell>

                <TableCell className={col.specialization}>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${
                      specializationStyles[doctor.specialization] ??
                      "bg-primary/10 text-primary"
                    }`}
                  >
                    {doctor.specialization}
                  </span>
                </TableCell>

                <TableCell className={col.patients}>
                  <Link
                    href={`/dashboard/doctors/${doctor.id}`}
                    className="inline-flex items-center gap-1.5 tabular-nums hover:text-primary hover:underline"
                  >
                    <UsersRound className="size-3.5 text-muted-foreground" />
                    {patientCount(doctor.id)}
                  </Link>
                </TableCell>

                <TableCell
                  className={`${col.joined} text-muted-foreground tabular-nums`}
                >
                  {formatDate(doctor.createdAt)}
                </TableCell>

                <TableCell className="pr-2 sm:pr-4">
                  <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                    <Link
                      href={`/dashboard/doctors/${doctor.id}`}
                      title="View doctor & patients"
                      aria-label={`View ${doctor.name}`}
                      className="inline-flex size-7 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Eye className="size-4" />
                    </Link>
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
              <TableCell colSpan={7} className="h-48">
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
      <div className="flex items-center justify-between gap-3 border-t px-3 py-2.5 sm:px-4 sm:py-3">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {doctors.length === 0 ? 0 : start + 1}–
            {Math.min(start + ITEMS_PER_PAGE, doctors.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{doctors.length}</span>{" "}
          doctors
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
            <span className="hidden sm:inline">Previous</span>
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

export default DoctorTable
