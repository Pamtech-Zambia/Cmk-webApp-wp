import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/server"
import { CmkReviewsDashboard } from "@/components/cmk-reviews-dashboard"
import type { Review } from "@/lib/types"

export const metadata: Metadata = {
  title: "Reviews · CMK Admin",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function CmkReviewsPage() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })

  return <CmkReviewsDashboard initialReviews={(data as Review[]) || []} />
}
