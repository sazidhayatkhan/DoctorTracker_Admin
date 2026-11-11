"use client"

import { useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ApiError, getErrorMessage } from "@/lib/api/errors"
import { NAME_MAX, NAME_MIN, type DirectoryConfig } from "../config"
import { useCreateDirectoryItem, useUpdateDirectoryItem } from "../queries"
import type { DirectoryItem } from "../schemas"

type DirectoryFormDialogProps = {
  config: DirectoryConfig
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The record to edit; null to create a new one */
  item: DirectoryItem | null
}

const DirectoryFormDialog = ({
  config,
  open,
  onOpenChange,
  item,
}: DirectoryFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      {/* Keyed so the fields reset for each record */}
      <DirectoryForm
        key={item?.id ?? "new"}
        config={config}
        item={item}
        onDone={() => onOpenChange(false)}
      />
    </DialogContent>
  </Dialog>
)

type FieldErrors = { name?: string; detail?: string; form?: string }

const DirectoryForm = ({
  config,
  item,
  onDone,
}: {
  config: DirectoryConfig
  item: DirectoryItem | null
  onDone: () => void
}) => {
  const [name, setName] = useState(item?.name ?? "")
  const [detail, setDetail] = useState(item?.detail ?? "")
  const [errors, setErrors] = useState<FieldErrors>({})

  const create = useCreateDirectoryItem(config)
  const update = useUpdateDirectoryItem(config)
  const isPending = create.isPending || update.isPending
  const noun = config.singular.toLowerCase()

  const validate = (): FieldErrors => {
    const trimmed = name.trim()
    if (trimmed.length < NAME_MIN)
      return { name: `Name must be at least ${NAME_MIN} characters.` }
    if (trimmed.length > NAME_MAX)
      return { name: `Name must be at most ${NAME_MAX} characters.` }
    return {}
  }

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      if (err.status === 409) return setErrors({ name: err.message })
      const { name, [config.detail.field]: detail } = err.fieldErrors
      if (name || detail) return setErrors({ name, detail })
    }
    setErrors({ form: getErrorMessage(err) })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate()
    if (found.name) return setErrors(found)

    const data = { name: name.trim(), detail: detail.trim() }
    const options = { onSuccess: onDone, onError: handleError }

    if (item) update.mutate({ id: item.id, data }, options)
    else create.mutate(data, options)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogHeader>
        <DialogTitle>{item ? `Edit ${noun}` : `Add ${noun}`}</DialogTitle>
        <DialogDescription>
          {item
            ? `Changes apply to every doctor at this ${noun}.`
            : `Names are unique, ignoring case.`}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 p-4">
        <div className="space-y-1.5">
          <label htmlFor="directory-name" className="text-xs font-medium">
            Name
          </label>
          <Input
            id="directory-name"
            value={name}
            maxLength={NAME_MAX}
            disabled={isPending}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "directory-name-error" : undefined}
            onChange={(e) => {
              setName(e.target.value)
              setErrors({})
            }}
            autoFocus
          />
          {errors.name && (
            <p id="directory-name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="directory-detail" className="text-xs font-medium">
              {config.detail.label}{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {detail.length}/{config.detail.max}
            </span>
          </div>
          <Textarea
            id="directory-detail"
            rows={3}
            value={detail}
            maxLength={config.detail.max}
            placeholder={config.detail.placeholder}
            disabled={isPending}
            aria-invalid={!!errors.detail}
            onChange={(e) => {
              setDetail(e.target.value)
              setErrors({})
            }}
            className="max-h-48"
          />
          {errors.detail && (
            <p className="text-xs text-destructive">{errors.detail}</p>
          )}
        </div>

        {errors.form && (
          <p role="alert" className="text-xs text-destructive">
            {errors.form}
          </p>
        )}
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {item ? "Save changes" : `Add ${noun}`}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default DirectoryFormDialog
