import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * Verifies that the current request is from an authenticated admin user.
 * Returns the user object if valid, or a NextResponse with 401/403 status if not.
 */
export async function requireAdmin(): Promise<
  | { user: { id: string; email: string }; error: null }
  | { user: null; error: NextResponse }
> {
  const supabase = await createClient()
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    }
  }

  // Check if user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle()

  if (profileError || !profile?.is_admin) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      ),
    }
  }

  return {
    user: { id: user.id, email: user.email ?? "" },
    error: null,
  }
}
