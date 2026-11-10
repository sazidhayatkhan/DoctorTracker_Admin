"use client"

import { Search, CalendarDays } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { specializations } from "../data"

const DoctorFilter = () => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative min-w-0 flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, mobile or email..."
          className="pl-9"
        />
      </div>

      {/* Specialization */}
      <Select>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Specializations" />
        </SelectTrigger>
        <SelectContent>
          {specializations.map((specialization) => (
            <SelectItem key={specialization} value={specialization}>
              {specialization}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range */}
      <div className="relative w-full sm:w-[155px]">
        <CalendarDays className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="date" className="pl-9" aria-label="From date" />
      </div>

      <span className="hidden text-sm text-muted-foreground sm:block">to</span>

      <div className="relative w-full sm:w-[155px]">
        <CalendarDays className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="date" className="pl-9" aria-label="To date" />
      </div>
    </div>
  )
}

export default DoctorFilter
