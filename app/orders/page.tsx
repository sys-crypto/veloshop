import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Check, Package } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getCurrentUser, isAdmin } from "@/lib/session"
import { getOrdersForUser, getPendingOrdersForAdmin, type Order, type AdminOrder } from "@/lib/orders"
import { confirmOrderAction } from "@/app/actions/orders"
import { formatPrice, formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Мои заказы — Phillips",
}

export default async function OrdersPage() {
  const user = await getCurrentUser()
  const admin = await isAdmin(user)
  const [orders, pendingOrders] = await Promise.all([
    user ? getOrdersForUser(user.id) : Promise.resolve([]),
    admin ? getPendingOrdersForAdmin() : Promise.resolve([]),
  ])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader user={user} />

      <main className="mx-auto min-h-[50vh] max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          На главную
        </Link>

        {admin && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold uppercase text-foreground">
              На подтверждение{pendingOrders.length > 0 ? ` (${pendingOrders.length})` : ""}
            </h2>
            {pendingOrders.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Нет заказов, ожидающих подтверждения.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {pendingOrders.map((order) => (
                  <AdminOrderCard key={order.id} order={order} />
                ))}
              </ul>
            )}
          </section>
        )}

        <h1 className={`font-display text-3xl font-bold uppercase text-foreground sm:text-4xl ${admin ? "mt-10" : "mt-4"}`}>
          Мои заказы
        </h1>

        {!user ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
            <p className="text-muted-foreground">
              Войдите в аккаунт, чтобы увидеть историю своих заказов.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-10 text-center">
            <Package className="size-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">Заказов пока нет</p>
            <Link
              href="/#gallery"
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Смотреть велосипеды
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-5">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

function StatusBadge({ status }: { status: Order["status"] }) {
  if (status === "confirmed") {
    return (
      <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
        Подтверждён
      </span>
    )
  }
  return (
    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
      Ожидает подтверждения
    </span>
  )
}

function OrderItemsList({ items }: { items: Order["items"] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3">
          <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.productName}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-card-foreground">{item.productName}</p>
            <p className="text-xs text-muted-foreground">
              {item.model} · {item.color} · {item.quantity} шт.
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-foreground">
            {formatPrice(item.price * item.quantity)}
          </span>
        </li>
      ))}
    </ul>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <li className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Заказ от {formatDate(order.createdAt)}
          </p>
          <p className="mt-1 font-display text-lg font-bold text-card-foreground">
            Прибудет {formatDate(order.arrivesAt)}
          </p>
          <div className="mt-2">
            <StatusBadge status={order.status} />
          </div>
        </div>
        <span className="font-display text-xl font-bold text-foreground">
          {formatPrice(order.total)}
        </span>
      </div>

      <OrderItemsList items={order.items} />
    </li>
  )
}

function AdminOrderCard({ order }: { order: AdminOrder }) {
  return (
    <li className="rounded-3xl border border-primary/40 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {formatDate(order.createdAt)} · {order.customerName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{order.customerEmail}</p>
        </div>
        <span className="font-display text-xl font-bold text-foreground">
          {formatPrice(order.total)}
        </span>
      </div>

      <OrderItemsList items={order.items} />

      <form action={confirmOrderAction.bind(null, order.id)} className="mt-4">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Check className="size-4" />
          Подтвердить оплату
        </button>
      </form>
    </li>
  )
}
