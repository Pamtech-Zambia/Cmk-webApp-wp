import type { Metadata } from "next"
import { CmkSettingsDashboard } from "@/components/cmk-settings-dashboard"
import { createClient } from "@/lib/supabase/server"
import type { WishesOverride } from "@/lib/types"

export const metadata: Metadata = {
  title: "CMK · Settings",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function CmkSettingsPage() {
  const supabase = await createClient()

  // Fetch current settings
  const { data } = await supabase
    .from("settings")
    .select("key, value")

  const settings: Record<string, unknown> = {}
  if (data) {
    for (const row of data) {
      settings[row.key] = row.value
    }
  }

  const wishesOverride = (settings.wishes_override as WishesOverride) ?? null

  return <CmkSettingsDashboard initialWishesOverride={wishesOverride} />
}
