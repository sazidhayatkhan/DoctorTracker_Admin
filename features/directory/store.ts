import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { DirectoryKind } from "./config"

type DirectoryListState = {
  search: string
  page: number
  setSearch: (search: string) => void
  setPage: (page: number) => void
  clearSearch: () => void
}

/**
 * Search and page for one directory list. Survives navigating away and back
 * (and a reload, via sessionStorage). Changing the search returns to page 1.
 */
const createDirectoryListStore = (kind: DirectoryKind) =>
  create<DirectoryListState>()(
    persist(
      (set) => ({
        search: "",
        page: 1,
        setSearch: (search) => set({ search, page: 1 }),
        setPage: (page) => set({ page }),
        clearSearch: () => set({ search: "", page: 1 }),
      }),
      {
        name: `doctor-tracker-${kind}-filters`,
        storage: createJSONStorage(() => sessionStorage),
        partialize: ({ search, page }) => ({ search, page }),
      }
    )
  )

export const useHospitalListStore = createDirectoryListStore("hospital")
export const useSpecializationListStore =
  createDirectoryListStore("specialization")

const stores = {
  hospital: useHospitalListStore,
  specialization: useSpecializationListStore,
}

/** The list store for a directory; `kind` must not change between renders */
export const useDirectoryListStore = (kind: DirectoryKind) => stores[kind]()
