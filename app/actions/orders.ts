"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser, isAdmin } from "@/lib/session"
import { createOrder, confirmOrder, type OrderItemInput } from "@/lib/orders"
import { sendTelegramNotification } from "@/lib/telegram"
import { formatPrice, formatDate } from "@/lib/utils"

export type PlaceOrderResult =
  | { success: true; orderId: string; arrivesAt: string }
  | { success: false; error: string }

export async function placeOrderAction(items: OrderItemInput[]): Promise<PlaceOrderResult> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: "Войдите в аккаунт, чтобы оформить заказ" }
  }

  if (!items || items.length === 0) {
    return { success: false, error: "Корзина пуста" }
  }

  try {
    const order = await createOrder(user.id, items)

    // Best-effort — a failed notification should never fail the order itself.
    const itemsList = items
      .map((i) => `• ${i.productName} (${i.model}, ${i.color}) x${i.quantity} — ${formatPrice(i.price * i.quantity)}`)
      .join("\n")
    void sendTelegramNotification(
      `🔔 Новый заказ\n` +
        `От: ${user.name} (${user.email})\n\n` +
        `${itemsList}\n\n` +
        `Итого: ${formatPrice(order.total)}\n` +
        `Прибудет: ${formatDate(order.arrivesAt)}\n\n` +
        `Проверьте оплату и подтвердите заказ в разделе «Мои заказы» на сайте.`,
    )

    return { success: true, orderId: order.id, arrivesAt: order.arrivesAt }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Не удалось оформить заказ",
    }
  }
}

export type ConfirmOrderResult = { success: true } | { success: false; error: string }

export async function confirmOrderAction(orderId: string): Promise<ConfirmOrderResult> {
  const user = await getCurrentUser()
  if (!(await isAdmin(user))) {
    return { success: false, error: "Недостаточно прав" }
  }

  try {
    await confirmOrder(orderId)
    revalidatePath("/orders")
    return { success: true }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Не удалось подтвердить заказ",
    }
  }
}
