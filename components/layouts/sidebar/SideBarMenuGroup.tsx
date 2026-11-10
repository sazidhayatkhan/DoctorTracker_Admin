"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Stethoscope,
  UserPlus,
  ClipboardPlus,
  Users,
  UserRoundPlus,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const icons = {
  LayoutDashboard,
  Stethoscope,
  UserPlus,
  ClipboardPlus,
  Users,
  UserRoundPlus,
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
                  onClick={() => router.push(item.url)}
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
