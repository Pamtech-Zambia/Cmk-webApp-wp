import type { ReactNode } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { CmkSidebar } from "@/components/cmk-sidebar"
import { createClient } from "@/lib/supabase/server"
import { pruneInquiries } from "@/lib/inquiries-cleanup"

export const dynamic = "force-dynamic"

export default async function CmkLayout({ children }: { children: ReactNode }) {
  // Run a best-effort cleanup whenever any admin page is loaded so the
  // inquiries table never accumulates stale data even if /cmk/inquiries
  // itself is not visited for a while.
  await pruneInquiries()

  // Pull a quick count of "new" inquiries for the sidebar badge.
  const supabase = await createClient()
  const { count } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new")

  return (
    <SidebarProvider>
      <CmkSidebar newInquiriesCount={count ?? 0} />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-5" />
          <p className="font-serif text-sm font-semibold tracking-tight sm:text-base">
            Admin
          </p>
        </header>
        <div className="min-h-[calc(100dvh-3.5rem)]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
