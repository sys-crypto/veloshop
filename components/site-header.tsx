"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X, Bike, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-context"
import { AuthDialog } from "@/components/auth-dialog"
import { logoutAction } from "@/app/actions/auth"

type SessionUser = { id: string; name: string; email: string }

const links = [
  { label: "Велосипеды", href: "/#gallery" },
  { label: "Группсеты 蓝图", href: "/#groupsets" },
  { label: "Технологии", href: "/#technology" },
  { label: "Наследие", href: "/#heritage" },
]

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode)
    setAuthOpen(true)
  }
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { count, openCart } = useCart()
  const router = useRouter()
  const [, startTransition] = useTransition()

  const handleLogout = () => {
    setUserMenuOpen(false)
    startTransition(async () => {
      await logoutAction()
      router.refresh()
    })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bike className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
              Phillips
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Из Британии · Наслаждайтесь ездой
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Открыть корзину${count > 0 ? `, товаров: ${count}` : ""}`}
            className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="Аккаунт"
                aria-expanded={userMenuOpen}
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-foreground transition-colors hover:bg-muted sm:px-3"
              >
                <User className="size-5 shrink-0" />
                <span className="hidden max-w-24 truncate text-sm font-medium sm:inline">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Закрыть меню аккаунта"
                    className="fixed inset-0 z-[90]"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-[95] mt-2 w-48 rounded-2xl border border-border bg-card p-1.5 shadow-xl">
                    <p className="truncate px-3 py-1.5 text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-card-foreground transition hover:bg-muted"
                    >
                      Мои заказы
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-card-foreground transition hover:bg-muted"
                    >
                      Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="inline-flex h-10 items-center whitespace-nowrap rounded-full px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:px-3.5"
              >
                Войти
              </button>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="inline-flex h-10 items-center whitespace-nowrap rounded-full bg-primary px-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 sm:px-4"
              >
                Регистрация
              </button>
            </div>
          )}

          <a
            href="/#gallery"
            className="hidden whitespace-nowrap rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 lg:inline-flex"
          >
            Смотреть модели
          </a>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground lg:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 lg:hidden",
          open ? "max-h-80" : "max-h-0",
          "transition-[max-height] duration-300 ease-out",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#gallery"
            onClick={() => setOpen(false)}
            className="mt-1 whitespace-nowrap rounded-full bg-primary px-5 py-2 text-center text-sm font-semibold text-primary-foreground"
          >
            Смотреть модели
          </a>
        </nav>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} />
    </header>
  )
}
