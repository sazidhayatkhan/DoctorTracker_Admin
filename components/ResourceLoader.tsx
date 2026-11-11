"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import type { UseQueryResult } from "@tanstack/react-query"
import { ArrowLeft, SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError, getErrorMessage } from "@/lib/api/errors"

type ResourceLoaderProps<T> = {
  query: UseQueryResult<T>
  /** e.g. "patient" — used in the not-found / error messages */
  resourceName: string
  backHref: string
  backLabel: string
  children: (data: T) => ReactNode
}

/**
 * Renders a single-resource query: a skeleton while loading, a not-found or
 * error card if it fails, otherwise `children(data)`.
 */
const ResourceLoader = <T,>({
  query,
  resourceName,
  backHref,
  backLabel,
  children,
}: ResourceLoaderProps<T>) => {
  const { data, isPending, isError, error, refetch } = query

  if (data !== undefined) return children(data)

  if (isPending) {
    return (
      <div className="max-w-4xl space-y-6" aria-busy="true">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-4 border bg-card p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  // 400 = malformed ID in the URL, 404 = no such (or deleted) record
  const notFound =
    isError && error instanceof ApiError && [400, 404].includes(error.status)

  return (
    <div className="flex flex-col items-center gap-3 border bg-card px-4 py-16 text-center shadow-xs">
      <div className="flex size-12 items-center justify-center bg-muted">
        <SearchX className="size-6 text-muted-foreground" />
      </div>
      <p className="font-medium">
        {notFound
          ? `${resourceName[0].toUpperCase()}${resourceName.slice(1)} not found`
          : `Couldn't load this ${resourceName}`}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {notFound
          ? `This ${resourceName} doesn't exist or has been deleted.`
          : getErrorMessage(error)}
      </p>
      <div className="flex gap-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
        {!notFound && (
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}

export default ResourceLoader
