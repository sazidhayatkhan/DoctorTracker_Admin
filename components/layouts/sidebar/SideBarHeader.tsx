"use client"

import Image from "next/image"
import Link from "next/link"
import { HeartPulse } from "lucide-react"

import { SidebarHeader, useSidebar } from "@/components/ui/sidebar"

const SideBarHeader = () => {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarHeader className="flex h-16 shrink-0 items-center justify-center border-b">
      <Link
        href="/dashboard"
        aria-label="DoctorTracker dashboard"
        onClick={() => isMobile && setOpenMobile(false)}
        className="flex items-center justify-center"
      >
        {/* Full logo when expanded */}
        <Image
          src="/images/doctor_tracker_logo.png"
          alt="DoctorTracker"
          width={1000}
          height={331}
          priority
          className="h-10 w-auto group-data-[collapsible=icon]:hidden"
        />
        {/* Icon-only sidebar is too narrow for the wordmark */}
        <HeartPulse
          aria-hidden
          className="hidden size-5 text-[#36ab9f] group-data-[collapsible=icon]:block"
        />
      </Link>
    </SidebarHeader>
  )
}

export default SideBarHeader
