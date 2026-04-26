import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { sanitizeSizes } from "@/lib/product"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, price, image_url, category, sizes } = body

  const sanitizedSizes = sanitizeSizes(sizes)

  // If sizes are provided, derive base price from the smallest size
  // so existing UI that relies on `price` still works correctly.
  const basePrice =
    sanitizedSizes.length > 0
      ? sanitizedSizes.reduce(
          (min, s) => (s.price < min ? s.price : min),
          sanitizedSizes[0].price,
        )
      : typeof price === "number"
        ? price
        : Number.NaN

  if (!name || !Number.isFinite(basePrice) || basePrice < 0) {
    return NextResponse.json(
      { error: "Name and a valid price (or at least one size) are required." },
      { status: 400 },
    )
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: String(name).trim(),
      description: description ? String(description).trim() : null,
      price: basePrice,
      image_url: image_url || null,
      category: category ? String(category).trim() : null,
      sizes: sanitizedSizes,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}
