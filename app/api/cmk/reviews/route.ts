import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

// GET /api/cmk/reviews - Admin endpoint to fetch all reviews
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  const supabase = await createAdminClient()

  let query = supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reviews: data ?? [] })
}
