// Seeds the first admin user (Melody) into Supabase auth.users.
// The on_auth_user_created trigger then mirrors the user into public.profiles,
// and we also explicitly upsert the profile here so is_admin=true is guaranteed.
//
// Run with:
//   node --env-file-if-exists=/vercel/share/.env.project scripts/005-seed-admin-melody.mjs

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("[v0] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.")
  process.exit(1)
}

const ADMIN = {
  email: "chimwemwekausa@gmail.com",
  password: "MeloMelo96!",
  fullName: "Melody",
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function findUserByEmail(email) {
  // listUsers is paginated; we walk pages until we find the user or run out.
  let page = 1
  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (found) return found
    if (data.users.length < 200) return null
    page += 1
  }
  return null
}

async function main() {
  console.log("[v0] Seeding admin:", ADMIN.email)

  let user = await findUserByEmail(ADMIN.email)

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN.email,
      password: ADMIN.password,
      email_confirm: true,
      user_metadata: { full_name: ADMIN.fullName, is_admin: true },
    })
    if (error) throw error
    user = data.user
    console.log("[v0] Created auth user:", user.id)
  } else {
    // Reset password so the documented credentials always work, and keep metadata in sync.
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: ADMIN.password,
      email_confirm: true,
      user_metadata: { ...user.user_metadata, full_name: ADMIN.fullName, is_admin: true },
    })
    if (error) throw error
    console.log("[v0] Updated existing auth user:", user.id)
  }

  // Mirror into public.profiles and force is_admin = true. The trigger usually
  // does this on create, but we upsert defensively for both create and update.
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: ADMIN.email,
        full_name: ADMIN.fullName,
        is_admin: true,
      },
      { onConflict: "id" },
    )
  if (profileError) throw profileError

  console.log("[v0] Profile upserted; admin seed complete.")
}

main().catch((err) => {
  console.error("[v0] Seed failed:", err)
  process.exit(1)
})
