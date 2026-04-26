import type { Metadata } from "next"
import { CmkPromosDashboard } from "@/components/cmk-promos-dashboard"
import { createClient } from "@/lib/supabase/server"
import type { Promo } from "@/lib/types"

export const metadata: Metadata = {
  title: "CMK · Promos",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function CmkPromosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("promos")
    .select("*")
    .order("expires_at", { ascending: true })

  return <CmkPromosDashboard initialPromos={(data as Promo[]) || []} />
}
