import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Creates a request-scoped Supabase client wired to Next.js cookies.
 * Call this fresh in every Server Component / Server Action — it's cheap
 * (it just configures a fetch call), it does not need to be memoized.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Called from a Server Component, which can't write cookies.
            // Safe to ignore as long as the middleware below is refreshing
            // sessions on every request.
          }
        },
      },
    },
  )
}
