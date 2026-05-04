import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                      cookies: {
                              get(name: string) { return request.cookies.get(name)?.value },
                                      set(name: string, value: string, options: CookieOptions) {
                                                request.cookies.set({ name, value, ...options })
                                                          response = NextResponse.next({ request })
                                                                    response.cookies.set({ name, value, ...options })
                                                                            },
                                                                                    remove(name: string, options: CookieOptions) {
                                                                                              request.cookies.set({ name, value: "", ...options })
                                                                                                        response = NextResponse.next({ request })
                                                                                                                  response.cookies.set({ name, value: "", ...options })
                                                                                                                          },
                                                                                                                                },
                                                                                                                                    }
                                                                                                                                      )

                                                                                                                                        const { data: { user } } = await supabase.auth.getUser()

                                                                                                                                          // PROTECT ADMIN ROUTES
                                                                                                                                            if (request.nextUrl.pathname.startsWith("/cmk")) {
                                                                                                                                                if (!user) {
                                                                                                                                                      return NextResponse.redirect(new URL("/login", request.url))
                                                                                                                                                          }

                                                                                                                                                              const { data: profile } = await supabase
                                                                                                                                                                    .from("profiles")
                                                                                                                                                                          .select("is_admin")
                                                                                                                                                                                .eq("id", user.id)
                                                                                                                                                                                      .single()

                                                                                                                                                                                          if (!profile?.is_admin) {
                                                                                                                                                                                                // THIS IS WHERE YOUR ERROR MESSAGE COMES FROM
                                                                                                                                                                                                      const url = new URL("/login", request.url)
                                                                                                                                                                                                            url.searchParams.set("error", "unauthorized")
                                                                                                                                                                                                                  return NextResponse.redirect(url)
                                                                                                                                                                                                                      }
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                          return response
                                                                                                                                                                                                                          }

                                                                                                                                                                                                                          export const config = {
                                                                                                                                                                                                                            matcher: ["/cmk/:path*", "/login"],
                                                                                                                                                                                                                            }