"use client"

import { useState } from "react"
import { ShieldCheck, Truck } from "lucide-react"
import { formatPrice, originalPriceFromDiscount } from "@/lib/utils"
import { PRODUCT } from "@/lib/products"
import { BuyDialog } from "@/components/buy-dialog"

export function ProductPurchase() {
  const [open, setOpen] = useState(false)
  const originalPrice = originalPriceFromDiscount(PRODUCT.price, PRODUCT.discountPercent)

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 lg:sticky lg:top-24">
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
        {PRODUCT.name}
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold uppercase text-card-foreground">
        Шоссейный велосипед Phillips
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Дроп-бары для шоссе или прямой руль для города, несколько фирменных расцветок — все с
        полной трансмиссией L-TWOO 蓝图.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-display text-4xl font-bold text-foreground">
          {formatPrice(PRODUCT.price)}
        </span>
        <span className="text-lg text-muted-foreground line-through">
          {formatPrice(originalPrice)}
        </span>
        <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-bold text-destructive">
          -{PRODUCT.discountPercent}%
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 w-full rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Купить
      </button>

      <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Truck className="size-4 shrink-0 text-primary" />
          Быстрая доставка
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          Гарантия качества
        </li>
      </ul>

      <BuyDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
