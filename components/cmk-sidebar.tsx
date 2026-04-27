"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Inbox,
  LogOut,
  MessageCircleHeart,
  Package,
  Settings,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { SITE_CONFIG } from "@/lib/config"

type NavItem = {
  href: string
  label: string
  icon: typeof Package
  badge?: number
}

export function CmkSidebar({ newInquiriesCount = 0 }: { newInquiriesCount?: number }) {
  const pathname = usePathname() || ""

  const items: NavItem[] = [
    { href: "/cmk", label: "Products", icon: Package },
    { href: "/cmk/promos", label: "Promos", icon: Sparkles },
    {
      href: "/cmk/inquiries",
      label: "Inquiries",
      icon: Inbox,
      badge: newInquiriesCount > 0 ? newInquiriesCount : undefined,
    },
    { href: "/cmk/reviews", label: "Reviews", icon: Star },
    { href: "/cmk/wishes", label: "Wishes", icon: MessageCircleHeart },
    { href: "/cmk/admins", label: "Admins", icon: Users },
    { href: "/cmk/settings", label: "Settings", icon: Settings },
  ]

  function isActive(href: string) {
    if (href === "/cmk") return pathname === "/cmk"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/cmk"
          className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          aria-label={`${SITE_CONFIG.businessName} admin home`}
        >
          <BrandLogo size="sm" />
          <span className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-serif text-sm font-bold">
              {SITE_CONFIG.businessName}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              Admin
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link href={item.href}>
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge ? (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View public site">
              <Link href="/" target="_self">
                <Home aria-hidden="true" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action="/auth/sign-out" method="POST">
              <SidebarMenuButton
                type="submit"
                tooltip="Sign out"
                className="w-full"
              >
                <LogOut aria-hidden="true" />
                <span>Sign out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
