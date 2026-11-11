/** Error thrown for any non-2xx response (or a network failure: status 0) */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    /** Per-field messages from a 400 validation error, keyed by field name */
    public fieldErrors: Record<string, string> = {}
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/** Client errors (4xx) won't succeed on retry */
export const isClientError = (error: unknown) =>
  error instanceof ApiError && error.status >= 400 && error.status < 500

/** A message safe to show the user for any thrown value */
export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong."
