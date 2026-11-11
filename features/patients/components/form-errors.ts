import { ApiError, getErrorMessage } from "@/lib/api/errors"
import type { PatientFormErrors } from "./PatientForm"

const FORM_FIELDS = ["name", "phone", "email", "birthDate", "gender", "address"]

/**
 * Puts a failed save's error on the matching field(s). Returns a message
 * for the form-level banner when the error isn't about a specific field.
 */
export const applyServerErrors = (
  error: unknown,
  setErrors: (errors: PatientFormErrors) => void
): string | null => {
  if (error instanceof ApiError) {
    // 409 from the unique-phone rule
    if (error.status === 409 && /phone/i.test(error.message)) {
      setErrors({ phone: "A patient with this phone number already exists." })
      return null
    }

    // 400 validation errors arrive keyed by field
    const fieldErrors = Object.fromEntries(
      Object.entries(error.fieldErrors).filter(([field]) =>
        FORM_FIELDS.includes(field)
      )
    ) as PatientFormErrors

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return null
    }
  }

  return getErrorMessage(error)
}
