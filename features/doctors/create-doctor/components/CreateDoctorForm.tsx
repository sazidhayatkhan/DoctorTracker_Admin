"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import FormBanner from "@/components/FormBanner"
import { Button, buttonVariants } from "@/components/ui/button"
import DoctorForm from "../../components/DoctorForm"
import { applyServerErrors } from "../../components/form-errors"
import { useCreateDoctor } from "../../queries"
import type { Doctor } from "../../schemas"

const CreateDoctorForm = () => {
  const createDoctor = useCreateDoctor()
  const [created, setCreated] = useState<Doctor | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  return (
    <DoctorForm
      variant="page"
      idPrefix="create-doctor"
      className="border bg-card shadow-xs"
      disabled={createDoctor.isPending}
      onSubmit={(data, { reset, setErrors }) => {
        setFormError(null)
        setCreated(null)

        createDoctor.mutate(data, {
          onSuccess: (doctor) => {
            setCreated(doctor)
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
                <strong>{created.name}</strong> was created successfully.
              </span>
              <Link
                href={`/dashboard/doctors/${created.id}`}
                className="font-medium underline-offset-4 hover:underline"
              >
                View doctor
              </Link>
            </FormBanner>
          )
        )
      }
      footer={
        <div className="flex flex-col-reverse gap-2 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/doctors"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Cancel
          </Link>
          <Button type="submit" size="lg" disabled={createDoctor.isPending}>
            {createDoctor.isPending && <Loader2 className="animate-spin" />}
            Create Doctor
          </Button>
        </div>
      }
    />
  )
}

export default CreateDoctorForm
