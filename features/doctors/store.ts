import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type DoctorListFilters = {
  search: string
  /** "" = all specializations */
  specializationId: string
  /** yyyy-mm-dd, "" = no bound */
  from: string
  to: string
  page: number
}

type DoctorListState = DoctorListFilters & {
  setSearch: (search: string) => void
  setSpecializationId: (specializationId: string) => void
  setFrom: (from: string) => void
  setTo: (to: string) => void
  setPage: (page: number) => void
  clearFilters: () => void
}

const initialFilters: DoctorListFilters = {
  search: "",
  specializationId: "",
  from: "",
  to: "",
  page: 1,
}

/**
 * Doctor list filters and page. Lives outside the table so it survives
 * navigating to a doctor and back (and a reload, via sessionStorage).
 * Changing any filter returns to page 1.
 */
export const useDoctorListStore = create<DoctorListState>()(
  persist(
    (set) => ({
      ...initialFilters,
      setSearch: (search) => set({ search, page: 1 }),
      setSpecializationId: (specializationId) =>
        set({ specializationId, page: 1 }),
      setFrom: (from) => set({ from, page: 1 }),
      setTo: (to) => set({ to, page: 1 }),
      setPage: (page) => set({ page }),
      clearFilters: () => set(initialFilters),
    }),
    {
      name: "doctor-tracker-doctor-filters",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ search, specializationId, from, to, page }) => ({
        search,
        specializationId,
        from,
        to,
        page,
      }),
    }
  )
)
