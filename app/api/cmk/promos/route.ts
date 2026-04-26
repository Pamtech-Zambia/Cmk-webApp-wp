import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .order("expires_at", { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promos: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, description, image_url, cta_label, cta_url, expires_at } = body

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 })
  }
  if (!expires_at || isNaN(new Date(expires_at).getTime())) {
    return NextResponse.json(
      { error: "A valid expiry date is required." },
      { status: 400 },
    )
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("promos")
    .insert({
      title: String(title).trim(),
      description: description ? String(description).trim() : null,
      image_url: image_url || null,
      cta_label: cta_label ? String(cta_label).trim() : null,
      cta_url: cta_url ? String(cta_url).trim() : null,
      expires_at: new Date(expires_at).toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promo: data })
}
