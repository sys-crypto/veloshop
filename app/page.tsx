import { BikeCarousel } from "@/components/bike-carousel"
import { SiteHeader } from "@/components/site-header"
import { BikeContent } from "@/components/bike-content"
import { ProductPurchase } from "@/components/product-purchase"
import { SiteFooter } from "@/components/site-footer"
import { getCurrentUser } from "@/lib/session"

export default async function Page() {
  const user = await getCurrentUser()

  return (
    <div id="top" className="min-h-svh bg-background text-foreground">
      <SiteHeader user={user} />

      <main>
        {/* Hero + Gallery */}
        <section
          id="gallery"
          className="mx-auto max-w-6xl scroll-mt-16 px-4 pb-8 pt-12 sm:px-6 sm:pt-16"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Phillips × L-TWOO 蓝图
            </p>
            <h1 className="mt-5 text-balance font-display text-4xl font-bold uppercase leading-[1.05] text-foreground sm:text-6xl">
              Шоссейные велосипеды, созданные для езды
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
              Рамы с британским наследием, высокопрофильные аэроколёса DREAM и полные интегрированные
              группсеты L-TWOO 蓝图. Листайте линейку — автопрокрутка, стрелки и точки-индикаторы
              включены.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
            <div className="flex justify-center">
              <BikeCarousel />
            </div>
            <ProductPurchase />
          </div>
        </section>

        <BikeContent />
      </main>

      <SiteFooter />
    </div>
  )
}
