import { Disc, Feather, Gauge, Wind, Wrench, ShieldCheck } from "lucide-react"
import { PRODUCT_VARIANTS } from "@/lib/products"

const features = [
  {
    icon: Wind,
    title: "Аэроколёса DREAM",
    body: "Высокопрофильные ободья 700c рассекают встречный ветер и держат скорость на равнине, делая каждый оборот педалей дальше и быстрее.",
  },
  {
    icon: Feather,
    title: "Лёгкая рама",
    body: "Жёсткая, но лёгкая рама с аэродинамической нижней трубой и заниженными перьями сочетает комфорт на весь день с гоночной отзывчивостью.",
  },
  {
    icon: Disc,
    title: "Гидравлические дисковые тормоза",
    body: "Передний и задний дисковые роторы обеспечивают уверенное торможение в любую погоду с лёгким ходом ручки, которому доверяют шоссейники.",
  },
  {
    icon: Gauge,
    title: "Интегрированное переключение 蓝图",
    body: "Тормозно-переключательные ручки L-TWOO 蓝图 делают переключение чётким и интуитивным — руки не покидают руль.",
  },
]

const groupsets = [
  {
    name: "蓝图 R3",
    tag: "闸变一体套件 · Интегрированный комплект",
    speeds: "8 скоростей",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sbaMB7skpnzNWlok5OaXA9ZEQ4OlX3.png",
    alt: "Интегрированный тормозно-переключательный группсет L-TWOO 蓝图 R3",
    points: [
      "Цельные тормозно-переключательные ручки",
      "Совместимость с цепью высокого класса",
      "Более плавная и долговечная работа трансмиссии",
    ],
  },
  {
    name: "蓝图 R5",
    tag: "变速套件 · Скоростная система",
    speeds: "9 скоростей",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0YVohINj5XK0mjIcoiXYHXG1OzP9UG.png",
    alt: "Скоростная система L-TWOO 蓝图 R5 с манетками и переключателями",
    points: [
      "Согласованные манетки, передний и задний переключатели",
      "Точное, повторяемое индексное переключение",
      "Надёжная механика по отличной цене",
    ],
  },
]

export function BikeContent() {
  return (
    <>
      {/* Feature grid */}
      <section id="technology" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Создано для езды
          </p>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold uppercase text-foreground sm:text-4xl">
            Создан для скорости, настроен для шоссе
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Каждый Phillips сочетает отзывчивую раму с полной трансмиссией L-TWOO 蓝图, поэтому
            велосипед готов лететь прямо из коробки — будь то погоня за личным рекордом или ваша
            первая сотня километров.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold uppercase text-card-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Groupsets */}
      <section id="groupsets" className="scroll-mt-20 border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
              Серия L-TWOO 蓝图
            </p>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold uppercase text-foreground sm:text-4xl">
              Группсеты «Чертёж»
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Линейка 蓝图 («Чертёж») от L-TWOO предлагает надёжное механическое переключение по
              доступной цене. В названии число отражает количество скоростей — R3 работает на 8
              скоростях, R5 поднимается до 9 — обе с интегрированными тормозно-переключательными
              ручками.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {groupsets.map((g) => (
              <article
                key={g.name}
                className="overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.src || "/placeholder.svg"}
                    alt={g.alt}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {g.speeds}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{g.tag}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold uppercase text-card-foreground">
                    {g.name}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {g.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Wrench className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section id="heritage" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PRODUCT_VARIANTS[1].image || "/placeholder.svg"}
              alt={PRODUCT_VARIANTS[1].alt}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
              源自英国 · Из Британии
            </p>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold uppercase text-foreground sm:text-4xl">
              Имя с велоспортом в крови
            </h2>
            <div className="mt-4 space-y-4 text-pretty leading-relaxed text-muted-foreground">
              <p>
                Phillips несёт наследие, уходящее корнями в британский велоспорт — традицию создавать
                велосипеды, созданные для интенсивной езды и удовольствия на многие километры. Этот дух
                живёт в сегодняшней шоссейной линейке: чистые линии, смелые расцветки и качество хода,
                которое зовёт ехать дальше.
              </p>
              <p>
                От ярких шоссейных градиентов до строгой чёрной городской рамы — каждый велосипед
                укомплектован колёсами DREAM и полной трансмиссией 蓝图: полный, готовый к езде
                комплект, оправдывающий обещание: <em>наслаждайтесь ездой.</em>
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-8">
              <Stat value="700c" label="аэроколёса DREAM" />
              <Stat value="8–9" label="速 доступных скоростей" />
              <Stat value={String(PRODUCT_VARIANTS.length)} label="фирменные расцветки" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <ShieldCheck className="size-10 text-primary" />
          <h2 className="text-balance font-display text-3xl font-bold uppercase text-foreground sm:text-4xl">
            Готовы найти свой велосипед?
          </h2>
          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Изучите всю шоссейную линейку Phillips и варианты группсетов 蓝图 и отправляйтесь в путь на
            велосипеде, созданном для дальних дистанций.
          </p>
          <a
            href="#gallery"
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Смотреть галерею
          </a>
        </div>
      </section>
    </>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  )
}
