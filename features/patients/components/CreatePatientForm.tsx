"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import PatientForm from "./PatientForm"

type CreatePatientFormProps = {
  existingPhones: string[]
}

const CreatePatientForm = ({ existingPhones }: CreatePatientFormProps) => {
  // Phones registered during this visit, so the same patient can't be added twice
  const [addedPhones, setAddedPhones] = useState<string[]>([])
  const [createdName, setCreatedName] = useState<string | null>(null)

  return (
    <PatientForm
      idPrefix="create-patient"
      existingPhones={[...existingPhones, ...addedPhones]}
      className="border bg-card shadow-xs"
      onSubmit={(data, { reset }) => {
        // TODO: POST /patients, then router.push(`/dashboard/patients/${newId}`)
        setAddedPhones((prev) => [...prev, data.phone])
        setCreatedName(data.name)
        reset()
      }}
      header={
        createdName && (
          <div className="flex items-center gap-2 border-b border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="flex-1">
              <strong>{createdName}</strong> was registered successfully.
            </span>
            <Link
              href="/dashboard/patients"
              className="font-medium underline-offset-4 hover:underline"
            >
              View patients
            </Link>
          </div>
        )
      }
      footer={
        <div className="flex flex-col-reverse gap-2 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/patients"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Cancel
          </Link>
          <Button type="submit" size="lg">
            Create Patient
          </Button>
        </div>
      }
    />
  )
}

export default CreatePatientForm
