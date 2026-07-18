import { createClient } from "@supabase/supabase-js"

/**
 * Admin client authenticated with the Supabase secret key. This bypasses
 * Row Level Security entirely, so it must only ever be used from
 * server-only code (Server Actions / Server Components), and only after
 * checking the caller is actually the site owner (see isAdmin() in
 * lib/session.ts). Never import this from a "use client" file.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
