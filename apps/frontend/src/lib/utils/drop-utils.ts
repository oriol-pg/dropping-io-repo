import type { Price, ProductStock } from "@/types/drop"

export function formatPrice(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount / 100)
}

export function getStockStatus(stock: number): ProductStock {
  if (stock === 0) return "out_of_stock"
  if (stock <= 5) return "low_stock"
  return "in_stock"
}

export function getTimeRemaining(endDate: Date): {
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
} {
  const now = new Date().getTime()
  const end = endDate.getTime()
  const difference = end - now

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const hours = Math.floor(difference / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, isExpired: false }
}

export function calculateProgress(orderCount: number, totalStock: number): number {
  if (totalStock === 0) return 100
  return Math.min((orderCount / totalStock) * 100, 100)
}

export function getVariantMatrix(prices: Price[]): {
  sizes: string[]
  colors: string[]
  matrix: Record<string, Record<string, Price | null>>
} {
  const sizes = [...new Set(prices.map((p) => p.variantAttributes.size))].sort()
  const colors = [...new Set(prices.map((p) => p.variantAttributes.color))].sort()

  const matrix: Record<string, Record<string, Price | null>> = {}

  colors.forEach((color) => {
    matrix[color] = {}
    sizes.forEach((size) => {
      const price = prices.find((p) => p.variantAttributes.color === color && p.variantAttributes.size === size)
      matrix[color][size] = price || null
    })
  })

  return { sizes, colors, matrix }
}
