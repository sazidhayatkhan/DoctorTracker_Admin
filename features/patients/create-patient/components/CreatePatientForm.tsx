"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { useCreatePatient } from "../../queries"
import type { Patient } from "../../schemas"
import { formatPatientCode } from "../../utils"
import FormBanner from "@/components/FormBanner"
import PatientForm from "../../components/PatientForm"
import { applyServerErrors } from "../../components/form-errors"

const CreatePatientForm = () => {
  const createPatient = useCreatePatient()
  const [created, setCreated] = useState<Patient | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  return (
    <PatientForm
      idPrefix="create-patient"
      className="border bg-card shadow-xs"
      disabled={createPatient.isPending}
      onSubmit={(data, { reset, setErrors }) => {
        setFormError(null)
        setCreated(null)

        createPatient.mutate(data, {
          onSuccess: (patient) => {
            setCreated(patient)
            reset()
          },
          onError: (error) => setFormError(applyServerErrors(error, setErrors)),
        })
      }}
      header={
        formError ? (
          <FormBanner tone="error">{formError}</FormBanner>
        ) : (
          created && (
            <FormBanner tone="success">
              <span className="flex-1">
                <strong>{created.name}</strong> was registered as{" "}
                <span className="font-mono">
                  {formatPatientCode(created.patientCode)}
                </span>
                .
              </span>
              <Link
                href={`/dashboard/patients/${created.id}`}
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
            href="/dashboard/patients"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Cancel
          </Link>
          <Button type="submit" size="lg" disabled={createPatient.isPending}>
            {createPatient.isPending && <Loader2 className="animate-spin" />}
            Create Patient
          </Button>
        </div>
      }
    />
  )
}

export default CreatePatientForm
