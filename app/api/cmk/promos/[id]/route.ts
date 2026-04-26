import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await context.params
  const body = await request.json()

  const update: Record<string, unknown> = {}
  if (typeof body.title === "string") update.title = body.title.trim()
  if (typeof body.description === "string" || body.description === null)
    update.description = body.description ? String(body.description).trim() : null
  if (typeof body.image_url === "string" || body.image_url === null)
    update.image_url = body.image_url || null
  if (typeof body.cta_label === "string" || body.cta_label === null)
    update.cta_label = body.cta_label ? String(body.cta_label).trim() : null
  if (typeof body.cta_url === "string" || body.cta_url === null)
    update.cta_url = body.cta_url ? String(body.cta_url).trim() : null
  if (body.expires_at) {
    const d = new Date(body.expires_at)
    if (isNaN(d.getTime())) {
      return NextResponse.json(
        { error: "A valid expiry date is required." },
        { status: 400 },
      )
    }
    update.expires_at = d.toISOString()
  }
  update.updated_at = new Date().toISOString()

  if (Object.keys(update).length === 1) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("promos")
    .update(update)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promo: data })
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
  const { error } = await supabase.from("promos").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
