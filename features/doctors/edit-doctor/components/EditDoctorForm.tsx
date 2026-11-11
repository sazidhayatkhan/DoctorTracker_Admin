"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import FormBanner from "@/components/FormBanner"
import { Button, buttonVariants } from "@/components/ui/button"
import DoctorForm from "../../components/DoctorForm"
import { applyServerErrors } from "../../components/form-errors"
import { useUpdateDoctor } from "../../queries"
import type { Doctor } from "../../schemas"

type EditDoctorFormProps = {
  doctor: Doctor
}

const EditDoctorForm = ({ doctor }: EditDoctorFormProps) => {
  const updateDoctor = useUpdateDoctor(doctor.id)
  const [isSaved, setIsSaved] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const profileHref = `/dashboard/doctors/${doctor.id}`

  return (
    <DoctorForm
      variant="page"
      idPrefix="edit-doctor"
      initialValues={{
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        hospital: doctor.hospital?.name ?? "",
        specialization: doctor.specialization?.name ?? "",
      }}
      className="border bg-card shadow-xs"
      disabled={updateDoctor.isPending}
      onSubmit={(data, { setErrors }) => {
        setFormError(null)
        setIsSaved(false)

        updateDoctor.mutate(data, {
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
                href={profileHref}
                className="font-medium underline-offset-4 hover:underline"
              >
                View profile
              </Link>
            </FormBanner>
          )
        )
      }
      footer={
        <div className="flex flex-col-reverse gap-2 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end">
          <Link
            href={profileHref}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Cancel
          </Link>
          <Button type="submit" size="lg" disabled={updateDoctor.isPending}>
            {updateDoctor.isPending && <Loader2 className="animate-spin" />}
            Save Changes
          </Button>
        </div>
      }
    />
  )
}

export default EditDoctorForm
