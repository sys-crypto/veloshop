"use client"

import { useEffect, useState, useTransition } from "react"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import Link from "next/link"
import { cn, formatPrice, formatDate } from "@/lib/utils"
import { useCart } from "@/components/cart-context"
import { AuthDialog } from "@/components/auth-dialog"
import { placeOrderAction } from "@/app/actions/orders"

type SessionUser = { id: string; name: string; email: string }

export function CartDrawer({ user }: { user: SessionUser | null }) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, clearCart } =
    useCart()
  const [placed, setPlaced] = useState<{ arrivesAt: string } | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, closeCart])

  // Reset the "order placed" confirmation once the drawer is closed and
  // later reopened with a fresh cart.
  useEffect(() => {
    if (!isOpen) {
      setPlaced(null)
      setOrderError(null)
    }
  }, [isOpen])

  // Actually submits the cart to the server. The server action re-checks the
  // session cookie itself, so this is safe to call right after a successful
  // login/registration even before the `user` prop above has refreshed.
  const submitOrder = () => {
    setOrderError(null)
    startTransition(async () => {
      const result = await placeOrderAction(
        items.map((item) => ({
          productName: item.name,
          model: item.model,
          color: item.color,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
      )

      if (result.success) {
        setPlaced({ arrivesAt: result.arrivesAt })
        clearCart()
      } else {
        setOrderError(result.error)
        if (!user) setAuthOpen(true)
      }
    })
  }

  const handlePlaceOrder = () => {
    if (!user) {
      setAuthOpen(true)
      return
    }
    submitOrder()
  }

  return (
    <>
    <div
      className={cn(
        "fixed inset-0 z-[110] transition-opacity",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Закрыть корзину"
        tabIndex={isOpen ? 0 : -1}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase text-card-foreground">
            <ShoppingBag className="size-5 text-primary" />
            Корзина
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Закрыть"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {placed ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShoppingBag className="size-6" />
            </span>
            <p className="font-display text-lg font-semibold uppercase text-card-foreground">
              Заказ принят
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Мы проверим оплату и подтвердим заказ. Ожидаемая дата прибытия:{" "}
              <span className="text-foreground">{formatDate(placed.arrivesAt)}</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/orders"
                onClick={closeCart}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Мои заказы
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Продолжить покупки
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Ваша корзина пуста</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-2xl border border-border p-3">
                  <div className="relative aspect-square size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.model} · {item.color}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-border px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Уменьшить количество"
                          className="flex size-6 items-center justify-center rounded-full text-foreground transition hover:bg-muted"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Увеличить количество"
                          className="flex size-6 items-center justify-center rounded-full text-foreground transition hover:bg-muted"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Удалить из корзины"
                    className="flex size-7 shrink-0 items-center justify-center self-start rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              {!user && (
                <p className="mb-3 text-xs text-muted-foreground">
                  Для оформления заказа нужно войти в аккаунт — это можно сделать на следующем шаге.
                </p>
              )}
              {orderError && (
                <p className="mb-3 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                  {orderError}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Итого</span>
                <span className="font-display text-xl font-bold text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPending}
                className="mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
              >
                {isPending ? "Оформляем…" : "Оформить заказ"}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>

    <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onSuccess={submitOrder} />
    </>
  )
}
