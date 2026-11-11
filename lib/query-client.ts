import { QueryClient } from "@tanstack/react-query"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

import { isClientError } from "@/lib/api/errors"

/** How long cached data may be restored from storage after a reload */
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 12 // 12h

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Fresh for 1 minute: navigating back within that window costs no request.
        staleTime: 60 * 1000,
        // Keep unused data long enough for the persisted cache to be useful.
        gcTime: CACHE_MAX_AGE,
        retry: (failureCount, error) =>
          !isClientError(error) && failureCount < 2,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: false,
      },
    },
  })

let browserQueryClient: QueryClient | undefined

/** New client per server render; one shared client in the browser */
export const getQueryClient = () => {
  if (typeof window === "undefined") return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}

export const PERSIST_KEY = "doctor-tracker-query-cache"

/**
 * Persists the query cache to sessionStorage so a page reload renders
 * instantly from cache (then refetches anything stale in the background).
 * sessionStorage, not localStorage: patient data is cleared when the tab
 * closes instead of lingering on a shared computer.
 */
export const queryPersister = createSyncStoragePersister({
  storage: typeof window === "undefined" ? undefined : window.sessionStorage,
  key: PERSIST_KEY,
  throttleTime: 1000,
})

/** Drop every cached response, in memory and in storage (used on logout) */
export const clearQueryCache = () => {
  if (typeof window === "undefined") return
  browserQueryClient?.clear()
  try {
    window.sessionStorage.removeItem(PERSIST_KEY)
  } catch {
    // storage unavailable — nothing persisted to clear
  }
}
