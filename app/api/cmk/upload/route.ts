import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

// Allowed MIME types for image uploads
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
])

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  // Verify admin authentication
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const file = await request.blob()
  const filename = request.headers.get("x-filename") ?? `product-${Date.now()}`

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
  }

  // Validate MIME type
  const mimeType = file.type?.toLowerCase() || ""
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json(
      { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed." },
      { status: 400 }
    )
  }

  // Sanitize filename to prevent path traversal
  const sanitizedFilename = filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 100)

  const blob = await put(sanitizedFilename, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: mimeType,
  })

  return NextResponse.json({ url: blob.url })
}
