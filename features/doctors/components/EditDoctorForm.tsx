"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import DoctorForm from "./DoctorForm"
import type { Doctor } from "../data"

type EditDoctorFormProps = {
  doctor: Doctor
  hospitals: string[]
}

const EditDoctorForm = ({ doctor, hospitals }: EditDoctorFormProps) => {
  const [isSaved, setIsSaved] = useState(false)
  const profileHref = `/dashboard/doctors/${doctor.id}`

  return (
    <DoctorForm
      variant="page"
      idPrefix="edit-doctor"
      hospitals={hospitals}
      initialValues={{
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        hospital: doctor.hospital,
        specialization: doctor.specialization,
      }}
      className="border bg-card shadow-xs"
      onSubmit={() => {
        // TODO: PATCH /doctors/:id, then router.push(profileHref)
        setIsSaved(true)
      }}
      header={
        isSaved && (
          <div className="flex items-center gap-2 border-b border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="flex-1">Changes saved successfully.</span>
            <Link
              href={profileHref}
              className="font-medium underline-offset-4 hover:underline"
            >
              View profile
            </Link>
          </div>
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
          <Button type="submit" size="lg">
            Save Changes
          </Button>
        </div>
      }
    />
  )
}

export default EditDoctorForm
