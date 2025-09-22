"use client"

import { formatPrice } from "@/lib/utils/drop-utils"
import type { Price, PricingType } from "@/types/drop"
import { Icons } from "@workspace/ui/components/icons"
import { useEffect, useState } from "react"

interface PriceDisplayProps {
  price: Price
  pricingType: PricingType
}

export function PriceDisplay({ price, pricingType }: PriceDisplayProps) {
  const [currentPrice, setCurrentPrice] = useState(price.amount)
  const [nextPriceChange, setNextPriceChange] = useState<Date | null>(null)

  // Simulate dynamic pricing effects
  useEffect(() => {
    if (pricingType === "halving") {
      // Price halves every hour
      const interval = setInterval(() => {
        setCurrentPrice((prev) => Math.max(prev * 0.5, price.amount * 0.1))
      }, 3600000) // 1 hour

      // Set next price change time
      const now = new Date()
      const nextHour = new Date(now.getTime() + (60 - now.getMinutes()) * 60000)
      setNextPriceChange(nextHour)

      return () => clearInterval(interval)
    }
  }, [pricingType, price.amount])

  const getPriceIndicator = () => {
    switch (pricingType) {
      case "halving":
        return {
          icon: <Icons.LucideIcons.TrendingDown className="h-4 w-4 text-green-400" />,
          text: "Price decreasing",
          color: "text-green-400",
        }
      case "auction":
        return {
          icon: <Icons.LucideIcons.TrendingUp className="h-4 w-4 text-red-400" />,
          text: "Price increasing",
          color: "text-red-400",
        }
      default:
        return null
    }
  }

  const indicator = getPriceIndicator()

  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-700 bg-gray-900/30">
      {/* Current Price */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-bold text-purple-400">{formatPrice(currentPrice, price.currency)}</div>
          {currentPrice !== price.amount && (
            <div className="text-sm text-gray-400 line-through">{formatPrice(price.amount, price.currency)}</div>
          )}
        </div>

        {indicator && (
          <div className={`flex items-center space-x-1 ${indicator.color}`}>
            {indicator.icon}
            <span className="text-sm">{indicator.text}</span>
          </div>
        )}
      </div>

      {/* Dynamic Pricing Info */}
      {pricingType !== "fixed" && (
        <div className="space-y-2">
          {pricingType === "halving" && nextPriceChange && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Icons.LucideIcons.Clock className="h-4 w-4" />
              <span>Next price drop: {nextPriceChange.toLocaleTimeString()}</span>
            </div>
          )}

          {pricingType === "auction" && <div className="text-sm text-gray-400">Price increases with each purchase</div>}

          {pricingType === "tiered" && <div className="text-sm text-gray-400">Volume-based pricing active</div>}
        </div>
      )}

      {/* Savings Indicator */}
      {currentPrice < price.amount && (
        <div className="text-sm text-green-400 font-medium">
          You save {formatPrice(price.amount - currentPrice, price.currency)}!
        </div>
      )}
    </div>
  )
}
