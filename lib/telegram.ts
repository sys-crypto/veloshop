/**
 * Sends a plain-text message to the configured Telegram chat. Requires
 * TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment; silently does
 * nothing if either is missing, so the site works fine without Telegram
 * configured too. Never throws — a failed notification should never break
 * order placement itself.
 */
export async function sendTelegramNotification(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn("Telegram not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing)")
    return
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    if (!response.ok) {
      console.error("Telegram notify failed:", await response.text())
    }
  } catch (e) {
    console.error("Telegram notify failed:", e)
  }
}
