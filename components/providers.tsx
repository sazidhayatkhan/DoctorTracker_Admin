"use client"

import type { ReactNode } from "react"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import {
  CACHE_MAX_AGE,
  getQueryClient,
  queryPersister,
} from "@/lib/query-client"

/** Bump when cached response shapes change, to discard old persisted caches */
const CACHE_VERSION = "1"

const Providers = ({ children }: { children: ReactNode }) => (
  <PersistQueryClientProvider
    client={getQueryClient()}
    persistOptions={{
      persister: queryPersister,
      maxAge: CACHE_MAX_AGE,
      buster: CACHE_VERSION,
      dehydrateOptions: {
        // Only persist successful reads, never errors or in-flight queries.
        shouldDehydrateQuery: (query) => query.state.status === "success",
      },
    }}
  >
    {children}
    {process.env.NODE_ENV === "development" && (
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    )}
  </PersistQueryClientProvider>
)

export default Providers
