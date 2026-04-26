import { NextResponse } from "next/server"
import { createAdminClient, createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

// DELETE /api/cmk/admins/[id] - Remove admin status from a user
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await context.params

  // Prevent self-deletion
  if (user?.id === id) {
    return NextResponse.json(
      { error: "You cannot remove your own admin access" },
      { status: 400 }
    )
  }

  const supabase = await createAdminClient()

  // Check how many admins exist - don't allow removing the last one
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_admin", true)

  if (count !== null && count <= 1) {
    return NextResponse.json(
      { error: "Cannot remove the last admin" },
      { status: 400 }
    )
  }

  // Remove admin status (don't delete the user entirely)
  const { error } = await supabase
    .from("profiles")
    .update({ is_admin: false, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// PATCH /api/cmk/admins/[id] - Update admin user details
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await context.params
  const body = await request.json()
  const { fullName, password } = body

  const supabase = await createAdminClient()

  // Update profile
  if (fullName !== undefined) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }
  }

  // Update auth user password if provided
  if (password) {
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const { error: authError } = await supabase.auth.admin.updateUserById(id, {
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }
  }

  // Fetch updated profile
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin, created_at")
    .eq("id", id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json({ admin: profile })
}
