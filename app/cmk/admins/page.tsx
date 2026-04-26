import type { Metadata } from "next"
import { CmkAdminsDashboard } from "@/components/cmk-admins-dashboard"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "CMK · Admins",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

type AdminProfile = {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

export default async function CmkAdminsPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch all admin users
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin, created_at")
    .eq("is_admin", true)
    .order("created_at", { ascending: false })

  return (
    <CmkAdminsDashboard
      initialAdmins={(data as AdminProfile[]) || []}
      currentUserId={user?.id || ""}
    />
  )
}
