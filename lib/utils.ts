import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats an integer amount as Kyrgyzstani som, e.g. 15500 -> "15 500 сом" */
export function formatPrice(amount: number) {
  return `${amount.toLocaleString('ru-RU')} сом`
}

/** Derives the crossed-out "was" price from the current price and a discount %. */
export function originalPriceFromDiscount(price: number, discountPercent: number) {
  return Math.round(price / (1 - discountPercent / 100))
}

/** Formats an ISO date string as a Russian long date, e.g. "30 июля 2026" */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
