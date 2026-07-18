export type ProductVariant = {
  id: string
  model: string
  color: string
  image: string
  alt: string
  subtitle: string
}

export const PRODUCT = {
  id: "phillips-ltwoo",
  name: "Phillips × L-TWOO 蓝图",
  price: 25000,
  discountPercent: 35,
}

// The real product photos live in /public and are reused across the
// carousel, the model/color picker in the buy dialog, and the cart.
export const PRODUCT_VARIANTS: ProductVariant[] = [
  {
    id: "road-white-gold",
    model: "Road",
    color: "Белый / золотистый",
    image: "/phillips-road-white-gold.jpg",
    alt: "Шоссейный велосипед Phillips Road, белая рама с золотистой вилкой и колёсами DREAM",
    subtitle: "Дроп-бары и лёгкая рама для скорости на шоссе",
  },
  {
    id: "road-red-black",
    model: "Road",
    color: "Красный / чёрный",
    image: "/phillips-road-red-black.jpg",
    alt: "Шоссейный велосипед Phillips Road, красно-чёрный градиент рамы и колёса DREAM",
    subtitle: "Контрастный градиент и карбоновая вилка для шоссе",
  },
  {
    id: "road-mint-pink",
    model: "Road",
    color: "Мятный / розовый",
    image: "/phillips-road-mint-pink.jpg",
    alt: "Шоссейный велосипед Phillips Road, мятно-розовый градиент рамы и колёса DREAM",
    subtitle: "Пастельный градиент для яркого образа на шоссе",
  },
  {
    id: "road-blue-black",
    model: "Road",
    color: "Синий / чёрный",
    image: "/phillips-road-blue-black.jpg",
    alt: "Шоссейный велосипед Phillips Road, сине-чёрная рама и колёса DREAM",
    subtitle: "Глубокий синий тон на лёгкой шоссейной раме",
  },
  {
    id: "road-green-black",
    model: "Road",
    color: "Зелёный / чёрный",
    image: "/phillips-road-green-black.jpg",
    alt: "Шоссейный велосипед Phillips Road, зелёно-чёрная рама и колёса DREAM",
    subtitle: "Насыщенный зелёный оттенок для шоссе",
  },
  {
    id: "road-yellow-black",
    model: "Road",
    color: "Жёлтый / чёрный",
    image: "/phillips-road-yellow-black.jpg",
    alt: "Шоссейный велосипед Phillips Road, жёлто-чёрная рама и колёса DREAM",
    subtitle: "Яркий акцент для заметности на дороге",
  },
  {
    id: "city-black",
    model: "City",
    color: "Чёрный",
    image: "/phillips-city-black.jpg",
    alt: "Городской велосипед Phillips City, чёрная матовая рама с прямым рулём",
    subtitle: "Прямой руль и универсальная посадка для города",
  },
]
