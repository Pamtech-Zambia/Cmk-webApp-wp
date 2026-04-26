import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Refreshes the Supabase auth cookie on every request and gates the /cmk
 * admin area behind a logged-in admin profile.
 *
 * Notes:
 * - Auth pages (`/auth/*`) and the auth callback are always allowed through.
 * - Logged-in users hitting `/auth/login` are bounced into `/cmk`.
 * - The admin check reads the public.profiles row (created by the SQL trigger)
 *   so non-admin signups can never reach the dashboard.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: keep this call right after createServerClient so the auth
  // cookie is refreshed before we make any redirect decisions.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdminArea = path.startsWith("/cmk")
  const isAuthRoute =
    path.startsWith("/auth/") || path === "/auth"

  if (isAdminArea && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("next", path)
    return NextResponse.redirect(url)
  }

  if (isAdminArea && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle()

    if (!profile?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("error", "not_admin")
      return NextResponse.redirect(url)
    }
  }

  // If a logged-in admin lands on the login page, send them straight to /cmk.
  if (isAuthRoute && user && path === "/auth/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/cmk"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
