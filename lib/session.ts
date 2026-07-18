import { cache } from "react"
import { createClient } from "@/lib/supabase/server"

export type User = {
  id: string
  name: string
  email: string
}

/**
 * Reads the current user from the Supabase session cookie. Wrapped in
 * React's cache() so multiple call sites in the same request (layout, page,
 * etc.) only hit Supabase once.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const metaName = user.user_metadata?.name
  const name =
    (typeof metaName === "string" && metaName.trim()) ||
    user.email?.split("@")[0] ||
    "Пользователь"

  return { id: user.id, name, email: user.email ?? "" }
})

/** True if the currently logged-in user is the site owner (matches ADMIN_EMAIL). */
export async function isAdmin(user: User | null): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!adminEmail || !user?.email) return false
  return user.email.trim().toLowerCase() === adminEmail
}
