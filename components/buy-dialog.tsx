"use client"

import { useEffect, useState } from "react"
import { Check, Minus, Plus, X } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { PRODUCT, PRODUCT_VARIANTS, type ProductVariant } from "@/lib/products"
import { useCart } from "@/components/cart-context"

export function BuyDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addItem, openCart } = useCart()
  const [selected, setSelected] = useState<ProductVariant>(PRODUCT_VARIANTS[0])
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  // Reset transient state each time the dialog is opened.
  useEffect(() => {
    if (open) {
      setJustAdded(false)
      setQuantity(1)
    }
  }, [open])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  if (!open) return null

  const handleConfirm = () => {
    addItem(
      {
        id: selected.id,
        name: PRODUCT.name,
        model: selected.model,
        color: selected.color,
        image: selected.image,
        price: PRODUCT.price,
      },
      quantity,
    )
    setJustAdded(true)
    setTimeout(() => {
      onOpenChange(false)
      openCart()
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Выбор модели и цвета"
        className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        {justAdded ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-7" />
            </span>
            <p className="font-display text-lg font-semibold uppercase text-card-foreground">
              Добавлено в корзину
            </p>
            <p className="text-sm text-muted-foreground">
              {PRODUCT.name} · {selected.model}, {selected.color}
            </p>
          </div>
        ) : (
          <>
            <h2 className="pr-8 font-display text-xl font-bold uppercase text-card-foreground">
              Модель и цвет
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{PRODUCT.name}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {PRODUCT_VARIANTS.map((variant) => {
                const active = variant.id === selected.id
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelected(variant)}
                    aria-pressed={active}
                    className={cn(
                      "group overflow-hidden rounded-2xl border-2 bg-muted text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <div className="relative aspect-[4/3] w-full bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={variant.image || "/placeholder.svg"}
                        alt={variant.alt}
                        className="h-full w-full object-contain"
                      />
                      {active && (
                        <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-card-foreground">
                        {variant.model}
                      </p>
                      <p className="text-xs text-muted-foreground">{variant.color}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Количество</span>
              <div className="flex items-center gap-3 rounded-full border border-border px-1 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Уменьшить количество"
                  disabled={quantity <= 1}
                  className="flex size-7 items-center justify-center rounded-full text-foreground transition hover:bg-muted disabled:opacity-40"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Увеличить количество"
                  className="flex size-7 items-center justify-center rounded-full text-foreground transition hover:bg-muted"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Итого</span>
              <span className="font-display text-xl font-bold text-foreground">
                {formatPrice(PRODUCT.price * quantity)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="mt-5 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Добавить в корзину
            </button>
          </>
        )}
      </div>
    </div>
  )
}
