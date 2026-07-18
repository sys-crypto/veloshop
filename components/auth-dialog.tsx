"use client"

import { useEffect, useState, useTransition, type FormEvent } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bike } from "lucide-react"
import { cn } from "@/lib/utils"
import { registerAction, loginAction } from "@/app/actions/auth"
import { PRODUCT_VARIANTS } from "@/lib/products"

type Mode = "login" | "register"

export function AuthDialog({
  open,
  onOpenChange,
  onSuccess,
  initialMode = "login",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  initialMode?: Mode
}) {
  const router = useRouter()
  // Portals need document.body, which only exists on the client — render
  // nothing until after mount to stay SSR-safe.
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<Mode>(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset the form each time the dialog opens.
  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setName("")
      setEmail("")
      setPassword("")
      setError(null)
    }
  }, [open, initialMode])

  // Close on Escape, and lock page scroll while this full-screen view is up.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onOpenChange])

  if (!mounted || !open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result =
        mode === "login"
          ? await loginAction({ email, password })
          : await registerAction({ name, email, password })

      if (result.success) {
        router.refresh()
        onOpenChange(false)
        onSuccess?.()
      } else {
        setError(result.error)
      }
    })
  }

  const showcase = PRODUCT_VARIANTS[0]

  return createPortal(
    <div className="fixed inset-0 z-[120] flex bg-background">
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        aria-label="Назад"
        className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full text-foreground transition hover:bg-muted sm:right-6 sm:top-6"
      >
        <ArrowLeft className="size-5" />
      </button>

      {/* Brand panel — large screens only */}
      <div className="relative hidden w-[42%] shrink-0 overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={showcase.image || "/placeholder.svg"}
          alt=""
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bike className="size-5" />
          </span>
          <p className="mt-4 font-display text-3xl font-bold uppercase text-foreground xl:text-4xl">
            Phillips
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Из Британии · Наслаждайтесь ездой. Войдите, чтобы отслеживать заказы и историю
            покупок.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bike className="size-4" />
            </span>
            <span className="font-display text-base font-bold uppercase tracking-tight text-foreground">
              Phillips
            </span>
          </div>

          <div className="mb-8 flex gap-1 rounded-full bg-muted p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login")
                setError(null)
              }}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition",
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register")
                setError(null)
              }}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition",
                mode === "register"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Регистрация
            </button>
          </div>

          <h2 className="font-display text-3xl font-bold uppercase text-foreground">
            {mode === "login" ? "С возвращением" : "Создать аккаунт"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Войдите, чтобы видеть историю своих заказов"
              : "Нужен для сохранения истории заказов"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "register" && (
              <div>
                <label htmlFor="auth-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Имя
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  placeholder="Как к вам обращаться"
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Пароль
              </label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Минимум 8 символов"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            >
              {isPending ? "Подождите…" : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}
