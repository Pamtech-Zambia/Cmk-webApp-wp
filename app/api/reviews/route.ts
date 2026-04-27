import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

// GET /api/reviews - Public endpoint to fetch approved reviews for testimonials
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured")
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50)

  const supabase = await createAdminClient()

  let query = supabase
    .from("reviews")
    .select("id, customer_name, rating, title, message, product_name, featured, created_at")
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (featured === "true") {
    query = query.eq("featured", true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reviews: data ?? [] })
}

// POST /api/reviews - Public endpoint for customers to submit reviews
export async function POST(request: Request) {
  const body = await request.json()
  const {
    customer_name,
    customer_email,
    rating,
    title,
    message,
    product_id,
    product_name,
  } = body

  // Validate required fields
  if (
    typeof customer_name !== "string" ||
    !customer_name.trim() ||
    customer_name.length > 100
  ) {
    return NextResponse.json(
      { error: "Name is required (max 100 characters)." },
      { status: 400 }
    )
  }

  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5." },
      { status: 400 }
    )
  }

  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 1000
  ) {
    return NextResponse.json(
      { error: "Review message is required (max 1000 characters)." },
      { status: 400 }
    )
  }

  // Optional email validation
  if (customer_email && typeof customer_email === "string") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer_email) || customer_email.length > 200) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }
  }

  // Optional title validation
  if (title && (typeof title !== "string" || title.length > 150)) {
    return NextResponse.json(
      { error: "Title must be under 150 characters." },
      { status: 400 }
    )
  }

  const supabase = await createAdminClient()

  const { error } = await supabase.from("reviews").insert({
    customer_name: customer_name.trim(),
    customer_email: customer_email?.trim() || null,
    rating,
    title: title?.trim() || null,
    message: message.trim(),
    product_id: product_id || null,
    product_name: product_name?.slice(0, 200) || null,
    status: "pending",
    featured: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you for your review! It will be visible once approved.",
  })
}
