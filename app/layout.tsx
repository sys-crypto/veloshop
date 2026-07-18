import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { getCurrentUser } from '@/lib/session'

const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'PHILLIPS × L-TWOO — Шоссейные велосипеды и группсеты 蓝图',
  description:
    'Шоссейные велосипеды Phillips с британским наследием, аэроколёсами DREAM и интегрированными группсетами L-TWOO 蓝图 R3/R5. Наслаждайтесь ездой.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()

  return (
    <html lang="ru" className={`dark bg-background ${oswald.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        <CartProvider>
          {children}
          <CartDrawer user={user} />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
