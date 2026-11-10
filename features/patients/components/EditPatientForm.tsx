"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import PatientForm from "./PatientForm"
import type { PatientRecord } from "../data"

type EditPatientFormProps = {
  patient: PatientRecord
}

const EditPatientForm = ({ patient }: EditPatientFormProps) => {
  const [isSaved, setIsSaved] = useState(false)
  const detailsHref = `/dashboard/patients/${patient.id}`

  return (
    <PatientForm
      idPrefix="edit-patient"
      initialValues={{
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
        birthDate: patient.birthDate,
        gender: patient.gender,
        address: patient.address,
      }}
      className="border bg-card shadow-xs"
      onSubmit={() => {
        // TODO: PATCH /patients/:id, then router.push(detailsHref)
        setIsSaved(true)
      }}
      header={
        isSaved && (
          <div className="flex items-center gap-2 border-b border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="flex-1">Changes saved successfully.</span>
            <Link
              href={detailsHref}
              className="font-medium underline-offset-4 hover:underline"
            >
              View patient
            </Link>
          </div>
        )
      }
      footer={
        <div className="flex flex-col-reverse gap-2 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end">
          <Link
            href={detailsHref}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Cancel
          </Link>
          <Button type="submit" size="lg">
            Save Changes
          </Button>
        </div>
      }
    />
  )
}

export default EditPatientForm
