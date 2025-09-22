"use client"

import type { Drop } from "@/types/drop"
import { useEffect, useState } from "react"

interface RealTimeDropData {
  viewCount: number
  orderCount: number
  revenueTotal: number
  stockUpdates: Record<string, number>
}

interface UseRealTimeDropReturn {
  drop: Drop
  isConnected: boolean
  lastUpdate: Date | null
}

export function useRealTimeDrop(initialDrop: Drop): UseRealTimeDropReturn {
  const [drop, setDrop] = useState<Drop>(initialDrop)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Simulate real-time updates via polling (in production, use WebSocket/SSE)
  useEffect(() => {
    setIsConnected(true)

    const interval = setInterval(() => {
      const updates: Partial<RealTimeDropData> = {}

      if (Math.random() > 0.3) {
        const change = Math.floor(Math.random() * 6) - 2 // -2 to +3
        updates.viewCount = Math.max(100, drop.viewCount + change)
      }

      if (Math.random() > 0.8) {
        updates.orderCount = drop.orderCount + 1
        updates.revenueTotal = drop.revenueTotal + 4500 // Price of one item

        // Update stock for a random variant
        const randomProduct = drop.products[0]
        const availablePrices = randomProduct.prices.filter((p) => p.metadata.stock > 0)
        if (availablePrices.length > 0) {
          const randomPrice = availablePrices[Math.floor(Math.random() * availablePrices.length)]
          updates.stockUpdates = {
            [randomPrice.id]: Math.max(0, randomPrice.metadata.stock - 1),
          }
        }
      }

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        setDrop((prevDrop) => {
          const updatedDrop = { ...prevDrop }

          if (updates.viewCount !== undefined) {
            updatedDrop.viewCount = updates.viewCount
          }

          if (updates.orderCount !== undefined) {
            updatedDrop.orderCount = updates.orderCount
          }

          if (updates.revenueTotal !== undefined) {
            updatedDrop.revenueTotal = updates.revenueTotal
          }

          if (updates.stockUpdates) {
            updatedDrop.products = updatedDrop.products.map((product) => ({
              ...product,
              prices: product.prices.map((price) => {
                if (updates.stockUpdates![price.id] !== undefined) {
                  return {
                    ...price,
                    metadata: {
                      ...price.metadata,
                      stock: updates.stockUpdates![price.id],
                    },
                  }
                }
                return price
              }),
            }))
          }

          return updatedDrop
        })

        setLastUpdate(new Date())
      }
    }, 3000) // Update every 3 seconds

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [drop.viewCount, drop.orderCount, drop.revenueTotal])

  return {
    drop,
    isConnected,
    lastUpdate,
  }
}
