import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type PatientListFilters = {
  search: string
  /** yyyy-mm-dd, "" = no bound */
  from: string
  to: string
  page: number
}

type PatientListState = PatientListFilters & {
  setSearch: (search: string) => void
  setFrom: (from: string) => void
  setTo: (to: string) => void
  setPage: (page: number) => void
  clearFilters: () => void
}

const initialFilters: PatientListFilters = {
  search: "",
  from: "",
  to: "",
  page: 1,
}

/**
 * Patient list filters and page. Lives outside the table so it survives
 * navigating to a patient and back (and a reload, via sessionStorage).
 * Changing any filter returns to page 1.
 */
export const usePatientListStore = create<PatientListState>()(
  persist(
    (set) => ({
      ...initialFilters,
      setSearch: (search) => set({ search, page: 1 }),
      setFrom: (from) => set({ from, page: 1 }),
      setTo: (to) => set({ to, page: 1 }),
      setPage: (page) => set({ page }),
      clearFilters: () => set(initialFilters),
    }),
    {
      name: "doctor-tracker-patient-filters",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ search, from, to, page }) => ({ search, from, to, page }),
    }
  )
)
