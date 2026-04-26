import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

// GET /api/cmk/admins - List all admin users
export async function GET() {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin, created_at")
    .eq("is_admin", true)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ admins: data })
}

// POST /api/cmk/admins - Create a new admin user
export async function POST(request: Request) {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await request.json()
  const { email, password, fullName } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    )
  }

  const supabase = await createAdminClient()

  // Create the auth user with admin metadata
  const { data: authData, error: authCreateError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName || null, is_admin: true },
    })

  if (authCreateError) {
    return NextResponse.json({ error: authCreateError.message }, { status: 400 })
  }

  // The trigger should create the profile, but upsert defensively
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: authData.user.id,
      email,
      full_name: fullName || null,
      is_admin: true,
    },
    { onConflict: "id" }
  )

  if (profileError) {
    // Try to clean up the auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({
    admin: {
      id: authData.user.id,
      email,
      full_name: fullName || null,
      is_admin: true,
      created_at: authData.user.created_at,
    },
  })
}
