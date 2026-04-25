import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, price, image_url, category } = body

  if (!name || typeof price !== "number" || price < 0) {
    return NextResponse.json(
      { error: "Name and a valid price are required." },
      { status: 400 },
    )
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: String(name).trim(),
      description: description ? String(description).trim() : null,
      price,
      image_url: image_url || null,
      category: category ? String(category).trim() : null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}
