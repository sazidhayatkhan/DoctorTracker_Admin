"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, UserRound } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { getInitials } from "@/features/doctors/utils"
import { useAuthStore } from "@/stores/auth.store"

const TopBar = () => {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [isOpen, setIsOpen] = useState(false)
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

  const handleSignOut = () => {
    setIsOpen(false)
    // Clears the session and every cached response; AuthGuard then
    // redirects to /login.
    logout()
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
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar
