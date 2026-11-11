"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { useUpdatePatient } from "../queries"
import type { Patient } from "../schemas"
import FormBanner from "./FormBanner"
import PatientForm from "./PatientForm"
import { applyServerErrors } from "./form-errors"

type EditPatientFormProps = {
  patient: Patient
}

const EditPatientForm = ({ patient }: EditPatientFormProps) => {
  const updatePatient = useUpdatePatient(patient.id)
  const [isSaved, setIsSaved] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
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
      disabled={updatePatient.isPending}
      onSubmit={(data, { setErrors }) => {
        setFormError(null)
        setIsSaved(false)

        updatePatient.mutate(data, {
          onSuccess: () => setIsSaved(true),
          onError: (error) => setFormError(applyServerErrors(error, setErrors)),
        })
      }}
      header={
        formError ? (
          <FormBanner tone="error">{formError}</FormBanner>
        ) : (
          isSaved && (
            <FormBanner tone="success">
              <span className="flex-1">Changes saved successfully.</span>
              <Link
                href={detailsHref}
                className="font-medium underline-offset-4 hover:underline"
              >
                View patient
              </Link>
            </FormBanner>
          )
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
          <Button type="submit" size="lg" disabled={updatePatient.isPending}>
            {updatePatient.isPending && <Loader2 className="animate-spin" />}
            Save Changes
          </Button>
        </div>
      }
    />
  )
}

export default EditPatientForm
