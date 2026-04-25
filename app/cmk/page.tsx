import type { Metadata } from "next"
import { CmkDashboard } from "@/components/cmk-dashboard"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

export const metadata: Metadata = {
  title: "CMK · Admin",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function CmkPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return <CmkDashboard initialProducts={(data as Product[]) || []} />
}
