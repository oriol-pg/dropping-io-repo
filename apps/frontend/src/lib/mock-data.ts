import type { Drop } from "@/types/drop"

export const mockDrop: Drop = {
  id: "drop_vintage_tees",
  profileId: "profile_vintageclub",
  slug: "vintage-tees-drop",
  title: "Limited Edition Vintage Tees",
  description: "Exclusive collection of hand-picked vintage t-shirts from the 90s",
  theme: {
    primaryColor: "#a21caf",
    secondaryColor: "#ffffff",
    backgroundColor: "#000000",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "md",
    layout: "grid",
    customCss: `
      .drop-title { letter-spacing: -0.02em; }
      .countdown { font-variant-numeric: tabular-nums; }
      .drop-title { color: #a21caf; }
    `,
  },
  status: "active", // Changed from "comming_soon" to "active"
  launchAt: new Date(Date.now() - 3600000), // Started 1 hour ago
  endAt: new Date(Date.now() + 7200000), // Ends in 2 hours
  pricingType: "fixed",
  pricingRules: null,
  maxPerCustomer: 2,
  viewCount: 234,
  orderCount: 47,
  revenueTotal: 211500,
  createdAt: new Date(),
  updatedAt: new Date(),

  profile: {
    id: "profile_vintageclub",
    authUserId: "auth_123",
    username: "vintageclub",
    displayName: "Vintage Club",
    avatarUrl: "./vintage-clothing-store-avatar.jpg",
    bio: "Curating the best vintage pieces since 2020",
    totalDrops: 12,
    activeDrops: 3,
    totalRevenue: 450000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  products: [
    {
      id: "product_classic_band_tee",
      dropId: "drop_vintage_tees",
      stripeProductId: "prod_mock123",
      name: "Classic Band Tee",
      description: "Authentic 90s band merchandise",
      images: [
        "./vintage-black-band-t-shirt-90s.jpg",
        "./vintage-white-band-t-shirt-90s.jpg",
        "./vintage-gray-band-t-shirt-90s.jpg",
      ],
      attributes: {
        availableSizes: ["S", "M", "L", "XL"],
        availableColors: ["Black", "White", "Gray"],
      },
      active: true,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      prices: [
        {
          id: "price_black_s",
          stripePriceId: "price_mock_black_s",
          productId: "product_classic_band_tee",
          variantLabel: "Black - S",
          variantAttributes: { size: "S", color: "Black" },
          amount: 4500,
          currency: "EUR",
          customPricingRules: null,
          active: true,
          metadata: { stock: 0 },
          createdAt: new Date(),
        },
        {
          id: "price_black_m",
          stripePriceId: "price_mock_black_m",
          productId: "product_classic_band_tee",
          variantLabel: "Black - M",
          variantAttributes: { size: "M", color: "Black" },
          amount: 4500,
          currency: "EUR",
          customPricingRules: null,
          active: true,
          metadata: { stock: 3 },
          createdAt: new Date(),
        },
        {
          id: "price_black_l",
          stripePriceId: "price_mock_black_l",
          productId: "product_classic_band_tee",
          variantLabel: "Black - L",
          variantAttributes: { size: "L", color: "Black" },
          amount: 4500,
          currency: "EUR",
          customPricingRules: null,
          active: true,
          metadata: { stock: 8 },
          createdAt: new Date(),
        },
        {
          id: "price_white_m",
          stripePriceId: "price_mock_white_m",
          productId: "product_classic_band_tee",
          variantLabel: "White - M",
          variantAttributes: { size: "M", color: "White" },
          amount: 4500,
          currency: "EUR",
          customPricingRules: null,
          active: true,
          metadata: { stock: 12 },
          createdAt: new Date(),
        },
        {
          id: "price_white_l",
          stripePriceId: "price_mock_white_l",
          productId: "product_classic_band_tee",
          variantLabel: "White - L",
          variantAttributes: { size: "L", color: "White" },
          amount: 4500,
          currency: "EUR",
          customPricingRules: null,
          active: true,
          metadata: { stock: 5 },
          createdAt: new Date(),
        },
        {
          id: "price_gray_l",
          stripePriceId: "price_mock_gray_l",
          productId: "product_classic_band_tee",
          variantLabel: "Gray - L",
          variantAttributes: { size: "L", color: "Gray" },
          amount: 4500,
          currency: "EUR",
          customPricingRules: null,
          active: true,
          metadata: { stock: 15 },
          createdAt: new Date(),
        },
      ],
    },
  ],
}

export const comingSoonDrop: Drop = {
  ...mockDrop,
  id: "drop_coming_soon",
  status: "coming_soon",
  launchAt: new Date(Date.now() + 86400000), // Launches in 24 hours
  endAt: new Date(Date.now() + 172800000), // Ends in 48 hours
  viewCount: 89,
  orderCount: 0,
  revenueTotal: 0,
}

export const archivedDrop: Drop = {
  ...mockDrop,
  id: "drop_archived",
  status: "archived",
  launchAt: new Date(Date.now() - 172800000), // Launched 48 hours ago
  endAt: new Date(Date.now() - 86400000), // Ended 24 hours ago
  viewCount: 456,
  orderCount: 89,
  revenueTotal: 400500,
  products: [
    {
      ...mockDrop.products[0],
      prices: mockDrop.products[0].prices.map((price) => ({
        ...price,
        metadata: { stock: Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 5) },
      })),
    },
  ],
}
