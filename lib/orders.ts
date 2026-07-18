import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export type OrderItemInput = {
  productName: string
  model: string
  color: string
  image: string
  price: number
  quantity: number
}

export type OrderItem = OrderItemInput & { id: string }

export type OrderStatus = "pending" | "confirmed"

export type Order = {
  id: string
  createdAt: string
  arrivesAt: string
  total: number
  status: OrderStatus
  items: OrderItem[]
}

/** Same as Order, plus who placed it — used in the admin confirmation list. */
export type AdminOrder = Order & {
  customerEmail: string
  customerName: string
}

type OrderItemRow = {
  id: string
  product_name: string
  model: string
  color: string
  image: string
  price: number
  quantity: number
}

function mapItemRow(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productName: row.product_name,
    model: row.model,
    color: row.color,
    image: row.image,
    price: row.price,
    quantity: row.quantity,
  }
}

const DELIVERY_DAYS = 14

/** Creates an order (and its line items) for a user. Delivery date = order date + 14 days. */
export async function createOrder(userId: string, items: OrderItemInput[]): Promise<Order> {
  if (items.length === 0) {
    throw new Error("Корзина пуста")
  }

  const supabase = await createClient()
  const now = new Date()
  const arrivesAt = new Date(now.getTime() + DELIVERY_DAYS * 24 * 60 * 60 * 1000)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      created_at: now.toISOString(),
      arrives_at: arrivesAt.toISOString(),
      total,
      status: "pending",
    })
    .select("id, created_at, arrives_at, total, status")
    .single()

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Не удалось создать заказ")
  }

  const { data: insertedItems, error: itemsError } = await supabase
    .from("order_items")
    .insert(
      items.map((item) => ({
        order_id: order.id,
        product_name: item.productName,
        model: item.model,
        color: item.color,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
    )
    .select("id, product_name, model, color, image, price, quantity")

  if (itemsError) {
    throw new Error(itemsError.message)
  }

  return {
    id: order.id,
    createdAt: order.created_at,
    arrivesAt: order.arrives_at,
    total: order.total,
    status: order.status as OrderStatus,
    items: ((insertedItems ?? []) as OrderItemRow[]).map(mapItemRow),
  }
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, arrives_at, total, status, order_items(id, product_name, model, color, image, price, quantity)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  type OrderRow = {
    id: string
    created_at: string
    arrives_at: string
    total: number
    status: string
    order_items: OrderItemRow[] | null
  }

  return ((orders ?? []) as unknown as OrderRow[]).map((order) => ({
    id: order.id,
    createdAt: order.created_at,
    arrivesAt: order.arrives_at,
    total: order.total,
    status: order.status as OrderStatus,
    items: (order.order_items ?? []).map(mapItemRow),
  }))
}

/** All pending orders across every customer — admin-only, bypasses RLS. */
export async function getPendingOrdersForAdmin(): Promise<AdminOrder[]> {
  const admin = createAdminClient()

  const { data: orders, error } = await admin
    .from("orders")
    .select(
      "id, user_id, created_at, arrives_at, total, status, order_items(id, product_name, model, color, image, price, quantity)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  type OrderRow = {
    id: string
    user_id: string
    created_at: string
    arrives_at: string
    total: number
    status: string
    order_items: OrderItemRow[] | null
  }

  const rows = (orders ?? []) as unknown as OrderRow[]

  const results: AdminOrder[] = []
  for (const order of rows) {
    const { data: userData } = await admin.auth.admin.getUserById(order.user_id)
    const customerEmail = userData?.user?.email ?? "неизвестно"
    const metaName = userData?.user?.user_metadata?.name
    const customerName = typeof metaName === "string" && metaName.trim() ? metaName : customerEmail

    results.push({
      id: order.id,
      createdAt: order.created_at,
      arrivesAt: order.arrives_at,
      total: order.total,
      status: order.status as OrderStatus,
      items: (order.order_items ?? []).map(mapItemRow),
      customerEmail,
      customerName,
    })
  }

  return results
}

/** Marks an order as confirmed — admin-only, bypasses RLS. */
export async function confirmOrder(orderId: string): Promise<void> {
  const admin = createAdminClient()
  const { error } = await admin
    .from("orders")
    .update({ status: "confirmed" })
    .eq("id", orderId)

  if (error) {
    throw new Error(error.message)
  }
}
