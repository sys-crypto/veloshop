"use server"

import { createClient } from "@/lib/supabase/server"

export type AuthResult = { success: true } | { success: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function registerAction(input: {
  name: string
  email: string
  password: string
}): Promise<AuthResult> {
  const name = input.name?.trim() ?? ""
  const email = input.email?.trim() ?? ""
  const password = input.password ?? ""

  if (!name) {
    return { success: false, error: "Введите имя" }
  }
  if (!EMAIL_RE.test(email)) {
    return { success: false, error: "Введите корректный email" }
  }
  if (password.length < 8) {
    return { success: false, error: "Пароль должен быть не короче 8 символов" }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (!data.session) {
    // The Supabase project has "Confirm email" turned on: the account was
    // created, but there's no session until the confirmation link is clicked.
    return {
      success: false,
      error: "Аккаунт создан. Проверьте почту и подтвердите регистрацию по ссылке, затем войдите.",
    }
  }

  return { success: true }
}

export async function loginAction(input: {
  email: string
  password: string
}): Promise<AuthResult> {
  const email = input.email?.trim() ?? ""
  const password = input.password ?? ""

  if (!EMAIL_RE.test(email) || !password) {
    return { success: false, error: "Неверный email или пароль" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, error: "Неверный email или пароль" }
  }

  return { success: true }
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
