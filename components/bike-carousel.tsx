"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { PRODUCT_VARIANTS } from "@/lib/products"

type Slide = {
  src: string
  alt: string
  title: string
  subtitle: string
}

const slides: Slide[] = [
  ...PRODUCT_VARIANTS.map((v) => ({
    src: v.image,
    alt: v.alt,
    title: `Phillips ${v.model} — ${v.color}`,
    subtitle: v.subtitle,
  })),
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sbaMB7skpnzNWlok5OaXA9ZEQ4OlX3.png",
    alt: "Интегрированный тормозно-переключательный группсет L-TWOO 蓝图 R3",
    title: "Группсет 蓝图 R3",
    subtitle: "Интегрированный тормозно-переключательный комплект с совместимостью цепи высокого класса",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0YVohINj5XK0mjIcoiXYHXG1OzP9UG.png",
    alt: "Детальные виды скоростной системы L-TWOO 蓝图 R5",
    title: "Скоростная система 蓝图 R5",
    subtitle: "Манетки, передний и задний переключатели для плавного переключения",
  },
]

const AUTOPLAY_MS = 4000

export function BikeCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  const count = slides.length
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + count) % count)
      setProgressKey((k) => k + 1)
    },
    [count],
  )
  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  const autoplayActive = isPlaying && !isHovered

  // Autoplay
  useEffect(() => {
    if (!autoplayActive) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % count)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [autoplayActive, count, current])

  // Keyboard navigation
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        next()
      }
    },
    [next, prev],
  )

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      if (touchDeltaX.current < 0) next()
      else prev()
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  return (
    <section
      className="mx-auto w-full max-w-2xl outline-none lg:mx-0 lg:max-w-none"
      aria-roledescription="карусель"
      aria-label="Галерея велосипедов Phillips"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div
        className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <figure
              key={slide.src}
              className="relative aspect-square w-full shrink-0 bg-muted sm:aspect-[4/3]"
              aria-roledescription="слайд"
              aria-label={`${i + 1} из ${count}`}
              aria-hidden={i !== current}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src || "/placeholder.svg"}
                alt={slide.alt}
                className="h-full w-full object-contain"
                draggable={false}
                loading={i === 0 ? "eager" : "lazy"}
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 pt-16 text-left sm:p-6 sm:pt-20">
                <h3 className="text-balance text-lg font-semibold text-white sm:text-xl">
                  {slide.title}
                </h3>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-white/80">
                  {slide.subtitle}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Предыдущий слайд"
          className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Следующий слайд"
          className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Play / pause */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Остановить автопрокрутку" : "Запустить автопрокрутку"}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>

        {/* Autoplay progress bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-white/10">
          {autoplayActive && (
            <div
              key={progressKey}
              className="h-full bg-primary"
              style={{ animation: `carousel-progress ${AUTOPLAY_MS}ms linear forwards` }}
            />
          )}
        </div>
      </div>

      {/* Dots */}
      <div
        className="mt-4 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Выбрать слайд"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Перейти к слайду ${i + 1}: ${slide.title}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              i === current
                ? "w-8 bg-primary"
                : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70",
            )}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes carousel-progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
