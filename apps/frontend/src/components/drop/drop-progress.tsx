"use client"

import { calculateProgress, formatPrice } from "@/lib/utils/drop-utils"
import type { Drop, Theme } from "@/types/drop"
import { Icons } from "@workspace/ui/components/icons"
import { Progress } from "@workspace/ui/components/progress"
import { useEffect, useState } from "react"

interface DropProgressProps {
  drop: Drop
  theme?: Theme
}

export function DropProgress({ drop, theme }: DropProgressProps) {
  const totalStock = drop.products.reduce(
    (total, product) => total + product.prices.reduce((sum, price) => sum + price.metadata.stock, 0),
    0,
  )

  const progress = calculateProgress(drop.orderCount, totalStock + drop.orderCount)
  const averageOrderValue = drop.orderCount > 0 ? drop.revenueTotal / drop.orderCount : 0

  const [progressAnimated, setProgressAnimated] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressAnimated(progress)
    }, 500)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div
      className="space-y-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-lg"
      style={{
        borderColor: theme?.secondaryColor || "#374151",
        backgroundColor: theme?.backgroundColor ? `${theme.backgroundColor}30` : "rgba(17, 24, 39, 0.3)",
      }}
    >
      <h3
        className="text-lg font-semibold flex items-center space-x-2"
        style={{ color: theme?.primaryColor || "#ffffff" }}
      >
        <Icons.LucideIcons.TrendingUp
          className="h-5 w-5 transition-transform duration-300 hover:rotate-12"
          style={{ color: theme?.primaryColor || "#c4b5fd" }}
        />
        <span>Drop Progress</span>
      </h3>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span style={{ color: theme?.secondaryColor || "#9ca3af" }}>Items Sold</span>
          <span className="font-medium transition-all duration-300" style={{ color: theme?.primaryColor || "#ffffff" }}>
            {drop.orderCount} / {totalStock + drop.orderCount}
          </span>
        </div>
        <div className="relative">
          <Progress
            value={progressAnimated}
            className="h-2 transition-all duration-1000 ease-out"
            style={{
              backgroundColor: theme?.secondaryColor ? `${theme.secondaryColor}30` : "rgba(107, 114, 128, 0.3)",
            }}
          />
          {progressAnimated > 75 && (
            <div
              className="absolute inset-0 h-2 rounded-full animate-pulse"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme?.primaryColor || "#8b5cf6"}40, transparent)`,
                animation: "shimmer 2s infinite",
              }}
            />
          )}
        </div>
        <div className="text-xs text-center" style={{ color: theme?.secondaryColor || "#9ca3af" }}>
          {progressAnimated.toFixed(1)}% sold
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 transition-transform duration-200 hover:scale-105">
          <div className="flex items-center space-x-1" style={{ color: theme?.secondaryColor || "#9ca3af" }}>
            <Icons.LucideIcons.Package className="h-4 w-4" />
            <span className="text-sm">Total Revenue</span>
          </div>
          <div className="text-lg font-bold" style={{ color: theme?.primaryColor || "#c4b5fd" }}>
            {formatPrice(drop.revenueTotal)}
          </div>
        </div>

        <div className="space-y-1 transition-transform duration-200 hover:scale-105">
          <div className="flex items-center space-x-1" style={{ color: theme?.secondaryColor || "#9ca3af" }}>
            <Icons.LucideIcons.DollarSign className="h-4 w-4" />
            <span className="text-sm">Avg. Order</span>
          </div>
          <div className="text-lg font-bold" style={{ color: theme?.primaryColor || "#c4b5fd" }}>
            {formatPrice(averageOrderValue)}
          </div>
        </div>
      </div>

      {/* Milestone Messages */}
      {progress >= 75 && progress < 90 && (
        <div className="text-sm text-center animate-bounce">🔥 Almost sold out - only a few items left!</div>
      )}

      {progress >= 90 && (
        <div className="text-sm text-center animate-pulse text-red-400 font-bold">⚡ Final items - selling fast!</div>
      )}
    </div>
  )
}
