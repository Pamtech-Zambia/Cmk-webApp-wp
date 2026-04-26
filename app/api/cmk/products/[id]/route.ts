import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { sanitizeSizes } from "@/lib/product"

export const runtime = "nodejs"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const body = await request.json()
  const supabase = await createAdminClient()

  const update: Record<string, unknown> = {}

  if (typeof body.name === "string") update.name = body.name.trim()
  if (body.description !== undefined)
    update.description = body.description ? String(body.description).trim() : null
  if (body.image_url !== undefined) update.image_url = body.image_url || null
  if (body.category !== undefined)
    update.category = body.category ? String(body.category).trim() : null

  // Sizes + price recomputation
  let sizesProvided = false
  let nextSizes: { label: string; price: number }[] = []
  if (body.sizes !== undefined) {
    nextSizes = sanitizeSizes(body.sizes)
    update.sizes = nextSizes
    sizesProvided = true
  }
  if (typeof body.price === "number" && body.price >= 0) {
    update.price = body.price
  } else if (sizesProvided && nextSizes.length > 0) {
    update.price = nextSizes.reduce(
      (min, s) => (s.price < min ? s.price : min),
      nextSizes[0].price,
    )
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 })
  }

  update.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("products")
    .update(update)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ product: data })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const supabase = await createAdminClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
