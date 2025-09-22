"use client"

import { getStockStatus } from "@/lib/utils/drop-utils"
import type { Price } from "@/types/drop"
import { Icons } from "@workspace/ui/components/icons"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"

interface StockIndicatorProps {
  price: Price
  viewerCount: number
}

export function StockIndicator({ price, viewerCount }: StockIndicatorProps) {
  const [reservationTimer, setReservationTimer] = useState<number | null>(null)
  const stockStatus = getStockStatus(price.metadata.stock)

  // Simulate reservation timer (15 minutes = 900 seconds)
  useEffect(() => {
    if (stockStatus === "reserved") {
      setReservationTimer(900)
      const interval = setInterval(() => {
        setReservationTimer((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(interval)
            return null
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [stockStatus])

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getStockDisplay = () => {
    switch (stockStatus) {
      case "out_of_stock":
        return {
          text: "Sold Out",
          className: "text-red-400 bg-red-500/10 border-red-500/20",
          icon: <Icons.LucideIcons.AlertTriangle className="h-4 w-4" />,
        }
      case "low_stock":
        return {
          text: `Only ${price.metadata.stock} left!`,
          className: "text-orange-400 bg-orange-500/10 border-orange-500/20 animate-pulse",
          icon: <Icons.LucideIcons.AlertTriangle className="h-4 w-4" />,
        }
      case "reserved":
        return {
          text: `Reserved - ${reservationTimer ? formatTimer(reservationTimer) : "0:00"}`,
          className: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
          icon: <Icons.LucideIcons.Clock className="h-4 w-4" />,
        }
      default:
        return {
          text: `${price.metadata.stock} available`,
          className: "text-green-400 bg-green-500/10 border-green-500/20",
          icon: null,
        }
    }
  }

  const stockDisplay = getStockDisplay()

  return (
    <div className="space-y-3">
      {/* Stock Status */}
      <div className={cn("flex items-center space-x-2 px-3 py-2 rounded-md border", stockDisplay.className)}>
        {stockDisplay.icon}
        <span className="font-medium">{stockDisplay.text}</span>
      </div>

      {/* Viewer Count */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <Icons.LucideIcons.Users className="h-4 w-4" />
        <span>{viewerCount} people viewing this item</span>
      </div>

      {/* Urgency Messages */}
      {stockStatus === "low_stock" && price.metadata.stock <= 3 && (
        <div className="text-xs text-orange-400 animate-pulse">⚡ High demand - limited stock remaining</div>
      )}

      {reservationTimer && reservationTimer < 300 && (
        <div className="text-xs text-yellow-400">⏰ Complete your purchase soon to secure this item</div>
      )}
    </div>
  )
}
