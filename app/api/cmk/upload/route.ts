import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const file = await request.blob()
  const filename = request.headers.get("x-filename") ?? `product-${Date.now()}`

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
  }

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type || "image/jpeg",
  })

  return NextResponse.json({ url: blob.url })
}
