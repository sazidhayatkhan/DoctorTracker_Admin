"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, UserRoundX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError, getErrorMessage } from "@/lib/api/errors"
import { usePatient } from "../queries"
import type { Patient } from "../schemas"

type PatientLoaderProps = {
  id: string
  children: (patient: Patient) => ReactNode
}

/** Fetches a patient and renders loading / not-found / error states around `children` */
const PatientLoader = ({ id, children }: PatientLoaderProps) => {
  const { data: patient, isPending, isError, error, refetch } = usePatient(id)

  if (patient) return children(patient)

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

  const notFound =
    isError && error instanceof ApiError && [400, 404].includes(error.status)

  return (
    <div className="flex flex-col items-center gap-3 border bg-card px-4 py-16 text-center shadow-xs">
      <div className="flex size-12 items-center justify-center bg-muted">
        <UserRoundX className="size-6 text-muted-foreground" />
      </div>
      <p className="font-medium">
        {notFound ? "Patient not found" : "Couldn't load this patient"}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {notFound
          ? "This patient doesn't exist or has been deleted."
          : getErrorMessage(error)}
      </p>
      <div className="flex gap-2">
        <Link
          href="/dashboard/patients"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to patients
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

export default PatientLoader
