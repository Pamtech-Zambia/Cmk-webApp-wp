import type { Metadata } from "next"
import { CmkInquiriesDashboard } from "@/components/cmk-inquiries-dashboard"
import { createClient } from "@/lib/supabase/server"
import type { Inquiry } from "@/lib/types"

export const metadata: Metadata = {
  title: "CMK · Inquiries",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function CmkInquiriesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500)

  return <CmkInquiriesDashboard initialInquiries={(data as Inquiry[]) || []} />
}
