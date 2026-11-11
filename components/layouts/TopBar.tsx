"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, UserRound } from "lucide-react"

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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getInitials } from "@/features/doctors/utils"
import { useAuthStore } from "@/stores/auth.store"

const TopBar = () => {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleProfile = () => {
    setIsOpen(false)
    router.push("/dashboard/profile")
  }

  const handleSignOutClick = () => {
    setIsOpen(false)
    setIsConfirmingSignOut(true)
  }

  const handleConfirmSignOut = () => {
    setIsConfirmingSignOut(false)
    // Clears the session and every cached response; AuthGuard then
    // redirects to the start page.
    signOut()
  }

  return (
    <header className="relative z-10 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        {/* Avatar Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {user ? getInitials(user.name) || "AD" : "AD"}
          </div>

          <span className="hidden text-sm font-medium sm:block">
            {user?.name ?? "Admin"}
          </span>

          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border bg-background p-1 shadow-lg">
            <div className="px-3 py-2 text-sm font-semibold">My Account</div>

            <div className="my-1 border-t" />

            <button
              type="button"
              onClick={handleProfile}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <UserRound className="size-4" />
              Profile
            </button>

            <div className="my-1 border-t" />

            <button
              type="button"
              onClick={handleSignOutClick}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        )}
      </div>

      <Dialog open={isConfirmingSignOut} onOpenChange={setIsConfirmingSignOut}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign out?</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You&apos;ll need to log in
              again to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmSignOut}>
              <LogOut />
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default TopBar
