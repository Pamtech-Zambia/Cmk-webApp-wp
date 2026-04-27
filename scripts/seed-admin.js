import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const ADMIN_EMAIL = "chimwemwekausa@gmail.com"
const ADMIN_PASSWORD = "Admin@CMK2024!"
const ADMIN_NAME = "Admin User"

async function seedAdmin() {
  console.log("Creating admin user...")

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find((u) => u.email === ADMIN_EMAIL)

  if (existingUser) {
    console.log("Admin user already exists, updating profile...")

    // Ensure profile exists with is_admin = true
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: existingUser.id,
        email: ADMIN_EMAIL,
        full_name: ADMIN_NAME,
        is_admin: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )

    if (profileError) {
      console.error("Error updating profile:", profileError.message)
      process.exit(1)
    }

    console.log("Admin profile updated successfully!")
    return
  }

  // Create new admin user
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: ADMIN_NAME,
      is_admin: true,
    },
  })

  if (createError) {
    console.error("Error creating admin user:", createError.message)
    process.exit(1)
  }

  console.log("Admin user created:", newUser.user.email)

  // Ensure profile is created with is_admin = true
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: newUser.user.id,
      email: ADMIN_EMAIL,
      full_name: ADMIN_NAME,
      is_admin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  if (profileError) {
    console.error("Error creating profile:", profileError.message)
    process.exit(1)
  }

  console.log("Admin seeded successfully!")
  console.log("Email:", ADMIN_EMAIL)
  console.log("Password:", ADMIN_PASSWORD)
}

seedAdmin()
