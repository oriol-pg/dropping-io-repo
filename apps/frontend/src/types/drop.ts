export interface Theme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  fontFamily: string
  borderRadius: "sm" | "md" | "lg" | "xl"
  layout: "grid" | "list"
  customCss?: string
}

export interface Profile {
  id: string
  authUserId: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string
  totalDrops: number
  activeDrops: number
  totalRevenue: number
  createdAt: Date
  updatedAt: Date
}

export interface Price {
  id: string
  stripePriceId: string
  productId: string
  variantLabel: string
  variantAttributes: Record<string, string>
  amount: number
  currency: string
  customPricingRules: any
  active: boolean
  metadata: { stock: number }
  createdAt: Date
}

export interface Product {
  id: string
  dropId: string
  stripeProductId: string
  name: string
  description: string
  images: string[]
  attributes: {
    availableSizes: string[]
    availableColors: string[]
  }
  active: boolean
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
  prices: Price[]
}

export type DropStatus = "coming_soon" | "active" | "archived"
export type PricingType = "fixed" | "halving" | "auction" | "tiered"

export interface Drop {
  id: string
  profileId: string
  slug: string
  title: string
  description: string
  theme: Theme
  status: DropStatus
  launchAt: Date
  endAt: Date
  pricingType: PricingType
  pricingRules: any
  maxPerCustomer: number
  viewCount: number
  orderCount: number
  revenueTotal: number
  createdAt: Date
  updatedAt: Date
  profile: Profile
  products: Product[]
}

export type ProductStock = "in_stock" | "low_stock" | "out_of_stock" | "reserved"
