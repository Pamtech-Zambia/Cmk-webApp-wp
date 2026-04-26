import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
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

export async function PUT(request: Request) {
  const body = await request.json()
  const { key, value } = body
  if (typeof key !== "string" || !key) {
    return NextResponse.json({ error: "Missing key." }, { status: 400 })
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
