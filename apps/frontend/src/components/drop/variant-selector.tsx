"use client"

import { getStockStatus, getVariantMatrix } from "@/lib/utils/drop-utils"
import type { Price, Product, Theme } from "@/types/drop"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

interface VariantSelectorProps {
  product: Product
  selectedPrice: Price | null
  onPriceSelect: (price: Price | null) => void
  theme?: Theme // Added theme prop
}

export function VariantSelector({ product, selectedPrice, onPriceSelect, theme }: VariantSelectorProps) {
  const { sizes, colors, matrix } = getVariantMatrix(product.prices)

  const getColorDisplay = (color: string) => {
    const colorMap: Record<string, string> = {
      Black: "#000000",
      White: "#FFFFFF",
      Gray: "#6B7280",
    }
    return colorMap[color] || color
  }

  return (
    <div
      className="space-y-6 p-6 rounded-lg border"
      style={{
        borderColor: theme?.secondaryColor || "#374151",
        backgroundColor: theme?.backgroundColor ? `${theme.backgroundColor}20` : "rgba(17, 24, 39, 0.5)",
      }}
    >
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme?.primaryColor || "#ffffff" }}>
          Select Options
        </h3>

        {/* Color Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium" style={{ color: theme?.secondaryColor || "#d1d5db" }}>
            Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const hasStock = sizes.some((size) => {
                const price = matrix[color][size]
                return price && price.metadata.stock > 0
              })

              const isSelected = selectedPrice?.variantAttributes.color === color

              return (
                <button
                  key={color}
                  disabled={!hasStock}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md border transition-all",
                    isSelected ? "text-white" : hasStock ? "hover:opacity-80" : "cursor-not-allowed opacity-50",
                  )}
                  style={{
                    borderColor: isSelected
                      ? theme?.primaryColor || "#8b5cf6"
                      : hasStock
                        ? theme?.secondaryColor || "#4b5563"
                        : "#374151",
                    backgroundColor: isSelected ? `${theme?.primaryColor || "#8b5cf6"}20` : "transparent",
                    color: isSelected
                      ? theme?.primaryColor || "#c4b5fd"
                      : hasStock
                        ? theme?.secondaryColor || "#d1d5db"
                        : "#6b7280",
                  }}
                  onClick={() => {
                    if (!hasStock) return
                    const availableSize = sizes.find((size) => {
                      const price = matrix[color][size]
                      return price && price.metadata.stock > 0
                    })
                    if (availableSize) {
                      onPriceSelect(matrix[color][availableSize])
                    }
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-400"
                    style={{ backgroundColor: getColorDisplay(color) }}
                  />
                  <span>{color}</span>
                  {!hasStock && (
                    <Badge variant="outline" className="text-xs">
                      Sold Out
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Size Selection */}
        {selectedPrice?.variantAttributes.color && (
          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: theme?.secondaryColor || "#d1d5db" }}>
              Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => {
                const price = matrix[selectedPrice.variantAttributes.color][size]
                const stockStatus = price ? getStockStatus(price.metadata.stock) : "out_of_stock"
                const isSelected = selectedPrice?.variantAttributes.size === size
                const isAvailable = price && price.metadata.stock > 0

                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    className={cn(
                      "px-4 py-3 rounded-md border text-center transition-all",
                      isSelected ? "text-white" : isAvailable ? "hover:opacity-80" : "cursor-not-allowed opacity-50",
                    )}
                    style={{
                      borderColor: isSelected
                        ? theme?.primaryColor || "#8b5cf6"
                        : isAvailable
                          ? theme?.secondaryColor || "#4b5563"
                          : "#374151",
                      backgroundColor: isSelected ? `${theme?.primaryColor || "#8b5cf6"}20` : "transparent",
                      color: isSelected
                        ? theme?.primaryColor || "#c4b5fd"
                        : isAvailable
                          ? theme?.secondaryColor || "#d1d5db"
                          : "#6b7280",
                    }}
                    onClick={() => {
                      if (price && isAvailable) {
                        onPriceSelect(price)
                      }
                    }}
                  >
                    <div className="font-medium">{size}</div>
                    {price && (
                      <div className="text-xs mt-1">
                        {stockStatus === "low_stock" && <span className="text-orange-400">Low Stock</span>}
                        {stockStatus === "out_of_stock" && <span className="text-red-400">Sold Out</span>}
                        {stockStatus === "in_stock" && (
                          <span className="text-green-400">{price.metadata.stock} left</span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedPrice && (
          <div
            className="mt-4 p-3 rounded-md border"
            style={{
              backgroundColor: `${theme?.primaryColor || "#8b5cf6"}10`,
              borderColor: `${theme?.primaryColor || "#8b5cf6"}20`,
            }}
          >
            <p className="text-sm" style={{ color: theme?.primaryColor || "#c4b5fd" }}>
              Selected: <span className="font-medium">{selectedPrice.variantLabel}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
