"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Stethoscope,
  UserPlus,
  ClipboardPlus,
  Users,
  UserRoundPlus,
  Building2,
  BriefcaseMedical,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const icons = {
  LayoutDashboard,
  Stethoscope,
  UserPlus,
  ClipboardPlus,
  Users,
  UserRoundPlus,
  Building2,
  BriefcaseMedical,
}

type IconName = keyof typeof icons

interface MenuItem {
  title: string
  url: string
  icon: IconName
}

interface SideBarMenuGroupProps {
  title?: string
  items: MenuItem[]
}

const SideBarMenuGroup = ({ title, items }: SideBarMenuGroupProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()

  const navigate = (url: string) => {
    // On mobile the sidebar is an overlay sheet: close it after picking a page.
    if (isMobile) setOpenMobile(false)
    router.push(url)
  }

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = icons[item.icon]

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  onClick={() => navigate(item.url)}
                >
                  <Icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default SideBarMenuGroup
