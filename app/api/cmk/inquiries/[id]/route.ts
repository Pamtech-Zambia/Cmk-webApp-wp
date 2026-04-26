import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

const STATUSES = new Set(["new", "replied", "closed"])

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await context.params
  const body = await request.json()
  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (typeof body.status === "string" && STATUSES.has(body.status)) {
    update.status = body.status
  }
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("inquiries")
    .update(update)
    .eq("id", id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inquiry: data })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await context.params
  const supabase = await createAdminClient()
  const { error } = await supabase.from("inquiries").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
