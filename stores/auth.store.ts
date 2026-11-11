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
  /**
   * True right after the admin chose "Sign out" (not persisted), so the
   * guard sends them to the start page instead of the login page.
   */
  signedOut: boolean
  setSession: (token: string, user: AuthUser) => void
  /** Session ended or expired: the guard sends the admin to /login */
  logout: () => void
  /** The admin signed out themselves: the guard sends them to / */
  signOut: () => void
}

/** Logged-in admin session, kept in localStorage across reloads */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      signedOut: false,
      setSession: (token, user) => set({ token, user, signedOut: false }),
      logout: () => {
        clearQueryCache()
        set({ token: null, user: null, signedOut: false })
      },
      signOut: () => {
        clearQueryCache()
        set({ token: null, user: null, signedOut: true })
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
