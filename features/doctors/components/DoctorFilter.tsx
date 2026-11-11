"use client"

import { CalendarDays, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { LookupOption } from "../schemas"
import { useHospitalOptions, useSpecializationOptions } from "../queries"
import { useDoctorListStore } from "../store"

const toItems = (allLabel: string, options: LookupOption[]) => [
  { label: allLabel, value: "" },
  ...options.map((o) => ({ label: o.name, value: o.id })),
]

/** Search, specialization, hospital and registration-date filters for the doctor list */
const DoctorFilter = () => {
  const {
    search,
    specializationId,
    hospitalId,
    from,
    to,
    setSearch,
    setSpecializationId,
    setHospitalId,
    setFrom,
    setTo,
    clearFilters,
  } = useDoctorListStore()
  const { data: specializations = [] } = useSpecializationOptions()
  const { data: hospitals = [] } = useHospitalOptions()

  const specializationItems = toItems("All Specializations", specializations)
  const hospitalItems = toItems("All Hospitals", hospitals)
  const hasFilters = !!(
    search.trim() ||
    specializationId ||
    hospitalId ||
    from ||
    to
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Search */}
      <div className="relative min-w-0 flex-1 sm:min-w-56">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, email or hospital..."
          aria-label="Search doctors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Specialization */}
      <Select
        items={specializationItems}
        value={specializationId}
        onValueChange={(v) => setSpecializationId((v as string | null) ?? "")}
      >
        <SelectTrigger
          className="w-full sm:w-[200px]"
          aria-label="Filter by specialization"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {specializationItems.map((item) => (
            <SelectItem key={item.value || "all"} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Hospital */}
      <Select
        items={hospitalItems}
        value={hospitalId}
        onValueChange={(v) => setHospitalId((v as string | null) ?? "")}
      >
        <SelectTrigger
          className="w-full sm:w-[200px]"
          aria-label="Filter by hospital"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {hospitalItems.map((item) => (
            <SelectItem key={item.value || "all"} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Registration date range */}
      <div className="relative w-full sm:w-[155px]">
        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="date"
          className="pl-9"
          aria-label="Registered from"
          value={from}
          max={to || undefined}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      <span className="hidden text-sm text-muted-foreground sm:block">to</span>

      <div className="relative w-full sm:w-[155px]">
        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="date"
          className="pl-9"
          aria-label="Registered to"
          value={to}
          min={from || undefined}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="self-start text-muted-foreground sm:self-auto"
        >
          <X />
          Clear
        </Button>
      )}
    </div>
  )
}

export default DoctorFilter
