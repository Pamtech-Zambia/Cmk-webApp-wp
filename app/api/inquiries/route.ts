import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

// Public endpoint: anyone can submit an inquiry.
export async function POST(request: Request) {
  const body = await request.json()
  const {
    product_id,
    product_name,
    size_label,
    customer_name,
    contact,
    message,
  } = body

  if (
    typeof customer_name !== "string" ||
    !customer_name.trim() ||
    typeof contact !== "string" ||
    !contact.trim() ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return NextResponse.json(
      { error: "Name, contact and a message are required." },
      { status: 400 },
    )
  }
  if (customer_name.length > 120 || contact.length > 200 || message.length > 2000) {
    return NextResponse.json(
      { error: "Please keep your inquiry within reasonable length." },
      { status: 400 },
    )
  }

  const supabase = await createAdminClient()
  const { error } = await supabase.from("inquiries").insert({
    product_id: product_id || null,
    product_name: product_name ? String(product_name).slice(0, 200) : null,
    size_label: size_label ? String(size_label).slice(0, 80) : null,
    customer_name: customer_name.trim(),
    contact: contact.trim(),
    message: message.trim(),
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
