import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const supabase = await createAdminClient()
  const { data, error } = await supabase.from("settings").select("*")
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const map: Record<string, unknown> = {}
  for (const row of data || []) {
    map[row.key as string] = row.value
  }
  return NextResponse.json({ settings: map })
}

// Allowed setting keys to prevent arbitrary data injection
const ALLOWED_SETTINGS_KEYS = new Set([
  "wishes_override",
  "site_name",
  "site_description",
  "contact_email",
  "contact_phone",
])

export async function PUT(request: Request) {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await request.json()
  const { key, value } = body
  if (typeof key !== "string" || !key) {
    return NextResponse.json({ error: "Missing key." }, { status: 400 })
  }

  // Validate that only allowed settings can be modified
  if (!ALLOWED_SETTINGS_KEYS.has(key)) {
    return NextResponse.json(
      { error: `Invalid setting key: ${key}` },
      { status: 400 }
    )
  }

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    )
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
