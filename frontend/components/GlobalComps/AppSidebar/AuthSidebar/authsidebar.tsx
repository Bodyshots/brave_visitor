import { Home, CircleHelp, UserRoundCog, Link2, LogOut, List } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import SiteTitle from "@/components/SiteFullTitle/SiteTitle/sitetitle"
import Link from "next/link"
import { ModeToggle } from "../../ModeToggle/modetoggle"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Conversation List",
    url: "/intentifier",
    icon: List,
  },
  {
    title: "Account Settings",
    url: "/settings",
    icon: UserRoundCog,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
  {
    title: "About us",
    url: "/about",
    icon: CircleHelp,
  },
]

export function AuthSidebar() {

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg text-foreground justify-center flex"><SiteTitle/></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle/>
      </SidebarFooter>
    </Sidebar>
  )
}
