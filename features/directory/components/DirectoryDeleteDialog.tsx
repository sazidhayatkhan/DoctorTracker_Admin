"use client"

import { useState } from "react"
import { Loader2, Trash2 } from "lucide-react"

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
import { getErrorMessage } from "@/lib/api/errors"
import type { DirectoryConfig } from "../config"
import { useDeleteDirectoryItem } from "../queries"
import type { DirectoryItem } from "../schemas"

type DirectoryDeleteDialogProps = {
  config: DirectoryConfig
  open: boolean
  /** Kept after closing so the text doesn't change during the fade-out */
  item: DirectoryItem | null
  onClose: () => void
  onViewDoctors: (item: DirectoryItem) => void
}

/** Confirms a delete. A record still used by doctors can't be deleted. */
const DirectoryDeleteDialog = ({
  config,
  open,
  item,
  onClose,
  onViewDoctors,
}: DirectoryDeleteDialogProps) => {
  const remove = useDeleteDirectoryItem(config)
  const [error, setError] = useState<string | null>(null)
  const noun = config.singular.toLowerCase()

  const close = () => {
    setError(null)
    remove.reset()
    onClose()
  }

  const handleDelete = () => {
    if (!item) return
    setError(null)
    remove.mutate(item.id, {
      onSuccess: close,
      onError: (err) => setError(getErrorMessage(err)),
    })
  }

  const inUse = !!item && item.doctorCount > 0

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {inUse ? `Can't delete this ${noun}` : `Delete ${noun}?`}
          </DialogTitle>
          <DialogDescription>
            {inUse ? (
              <>
                <span className="font-medium text-foreground">{item.name}</span>{" "}
                has {item.doctorCount} doctor
                {item.doctorCount === 1 ? "" : "s"}. Move{" "}
                {item.doctorCount === 1 ? "them" : "them all"} to another {noun}{" "}
                first.
              </>
            ) : (
              <>
                <span className="font-medium text-foreground">
                  {item?.name}
                </span>{" "}
                will be removed from the {noun} list and from the doctor form.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p role="alert" className="px-4 pt-4 text-xs text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {inUse ? "Close" : "Cancel"}
          </DialogClose>
          {inUse ? (
            <Button onClick={() => item && onViewDoctors(item)}>
              View doctors
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={remove.isPending}
            >
              {remove.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 />
              )}
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DirectoryDeleteDialog
