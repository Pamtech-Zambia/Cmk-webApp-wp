import { createAdminClient } from "@/lib/supabase/server"

/**
 * Auto-deletion policy for customer inquiries.
 * - Any inquiry older than MAX_AGE_DAYS is removed.
 * - Any inquiry that has been "closed" for more than CLOSED_AGE_DAYS is removed.
 *
 * This is invoked whenever the admin loads inquiries or a customer submits a
 * new one, which keeps the table small without needing a separate cron.
 */
export const MAX_AGE_DAYS = 30
export const CLOSED_AGE_DAYS = 7

export async function pruneInquiries(): Promise<void> {
  try {
    const supabase = await createAdminClient()
    const now = Date.now()
    const oldCutoff = new Date(now - MAX_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const closedCutoff = new Date(
      now - CLOSED_AGE_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString()

    // Hard-delete anything older than MAX_AGE_DAYS
    await supabase.from("inquiries").delete().lt("created_at", oldCutoff)

    // Tidy up closed inquiries that have been sitting around for a week
    await supabase
      .from("inquiries")
      .delete()
      .eq("status", "closed")
      .lt("updated_at", closedCutoff)
  } catch (err) {
    // Cleanup is best-effort — never block the page on a failed prune
    console.log("[v0] inquiries cleanup failed:", err)
  }
}
