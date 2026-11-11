import { useSyncExternalStore } from "react"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { clearQueryCache } from "@/lib/query-client"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  setSession: (token: string, user: AuthUser) => void
  logout: () => void
}

/** Logged-in admin session, kept in localStorage across reloads */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => {
        clearQueryCache()
        set({ token: null, user: null })
      },
    }),
    {
      name: "doctor-tracker-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ token, user }) => ({ token, user }),
    }
  )
)

/**
 * True once the persisted session has been read from storage. Always false
 * during server render and hydration, so server and client markup match.
 */
export const useAuthHydrated = () =>
  useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false
  )
