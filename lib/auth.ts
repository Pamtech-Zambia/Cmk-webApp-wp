import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * Core logic to check if the current session belongs to an admin.
  */
  export async function getAdminUser() {
    const supabase = await createClient()

      const {
          data: { user },
              error: authError,
                } = await supabase.auth.getUser()

                  if (authError || !user) return { user: null, is_admin: false }

                    // Check the profiles table for the admin flag
                      const { data: profile } = await supabase
                          .from("profiles")
                              .select("is_admin")
                                  .eq("id", user.id)
                                      .single()

                                        return {
                                            user,
                                                is_admin: !!profile?.is_admin,
                                                  }
                                                  }

                                                  /**
                                                   * For use in API Routes (like your routes.ts).
                                                    * Returns the user or a JSON error response.
                                                     */
                                                     export async function requireAdmin(): Promise<
                                                       | { user: { id: string; email: string }; error: null }
                                                         | { user: null; error: NextResponse }
                                                         > {
                                                           const { user, is_admin } = await getAdminUser()

                                                             if (!user) {
                                                                 return {
                                                                       user: null,
                                                                             error: NextResponse.json(
                                                                                     { error: "Authentication required" },
                                                                                             { status: 401 }
                                                                                                   ),
                                                                                                       }
                                                                                                         }

                                                                                                           if (!is_admin) {
                                                                                                               return {
                                                                                                                     user: null,
                                                                                                                           error: NextResponse.json(
                                                                                                                                   { error: "Admin access required" },
                                                                                                                                           { status: 403 }
                                                                                                                                                 ),
                                                                                                                                                     }
                                                                                                                                                       }

                                                                                                                                                         return {
                                                                                                                                                             user: { id: user.id, email: user.email ?? "" },
                                                                                                                                                                 error: null,
                                                                                                                                                                   }
                                                                                                                                                                   }