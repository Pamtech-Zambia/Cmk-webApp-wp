import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

const VALID_STATUSES = new Set(["pending", "approved", "rejected"])

// PATCH /api/cmk/reviews/[id] - Update review status, featured flag
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await context.params
  const body = await request.json()

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  // Update status if provided and valid
  if (typeof body.status === "string" && VALID_STATUSES.has(body.status)) {
    update.status = body.status
  }

  // Update featured flag if provided
  if (typeof body.featured === "boolean") {
    update.featured = body.featured
  }

  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("reviews")
    .update(update)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ review: data })
}

// DELETE /api/cmk/reviews/[id] - Delete a review
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await context.params
  const supabase = await createAdminClient()

  const { error } = await supabase.from("reviews").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
