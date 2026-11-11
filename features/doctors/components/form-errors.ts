import { ApiError, getErrorMessage } from "@/lib/api/errors"
import type { DoctorFormErrors } from "./DoctorForm"

/**
 * Puts a failed save's error on the matching field(s). Returns a message
 * for the form-level banner when the error isn't about a specific field.
 */
export const applyServerErrors = (
  error: unknown,
  setErrors: (errors: DoctorFormErrors) => void
): string | null => {
  if (error instanceof ApiError) {
    // 409 from the unique-email rule
    if (error.status === 409 && /email/i.test(error.message)) {
      setErrors({ email: "A doctor with this email already exists." })
      return null
    }

    // 404 when the chosen hospital / specialization was deleted meanwhile
    if (error.status === 404 && /hospital/i.test(error.message)) {
      setErrors({ hospital: "This hospital no longer exists. Pick another." })
      return null
    }
    if (error.status === 404 && /specialization/i.test(error.message)) {
      setErrors({
        specialization: "This specialization no longer exists. Pick another.",
      })
      return null
    }

    // 400 validation errors arrive keyed by API field name
    const map: Record<string, keyof DoctorFormErrors> = {
      name: "name",
      email: "email",
      phone: "phone",
      hospitalId: "hospital",
      specializationId: "specialization",
    }
    const fieldErrors: DoctorFormErrors = {}
    for (const [field, message] of Object.entries(error.fieldErrors)) {
      if (map[field]) fieldErrors[map[field]] = message
    }
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return null
    }
  }

  return getErrorMessage(error)
}
