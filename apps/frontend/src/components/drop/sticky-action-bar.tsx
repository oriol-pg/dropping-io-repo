"use client"

import { formatPrice } from "@/lib/utils/drop-utils"
import type { Drop, Price } from "@/types/drop"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Icons } from "@workspace/ui/components/icons"
import { useEffect, useState } from "react"
import { PurchaseFlow } from "./purchase-flow"

interface StickyActionBarProps {
  drop: Drop
  selectedPrice: Price | null
  viewerCount: number
}

export function StickyActionBar({ drop, selectedPrice, viewerCount }: StickyActionBarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false)
  const [priceChanged, setPriceChanged] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (selectedPrice) {
      setPriceChanged(true)
      setTimeout(() => setPriceChanged(false), 300)
    }
  }, [selectedPrice])

  const handlePurchase = () => {
    if (!selectedPrice) return
    setShowPurchaseFlow(true)
  }

  const canPurchase = selectedPrice && selectedPrice.metadata.stock > 0 && drop.status === "active"

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "backdrop-blur-md shadow-lg" : ""
        }`}
        style={{
          backgroundColor: isScrolled ? `${drop.theme.backgroundColor}CC` : drop.theme.backgroundColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left - Creator Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 lg:h-10 lg:w-10 transition-transform duration-200 hover:scale-110">
                <AvatarImage src="/vintage-clothing-store-avatar.jpg" />
                <AvatarFallback style={{ backgroundColor: drop.theme.primaryColor }}>
                  {drop.profile.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm lg:text-base" style={{ color: drop.theme.secondaryColor }}>
                  {drop.profile.displayName}
                </p>
                <div className="flex items-center space-x-2 text-xs lg:text-sm opacity-75">
                  <Icons.LucideIcons.Eye className="h-3 w-3 animate-pulse" />
                  <span>{viewerCount} viewing</span>
                </div>
              </div>
            </div>

            {/* Right - Purchase Actions */}
            <div className="flex items-center space-x-4">
              {selectedPrice ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p
                      className={`text-lg lg:text-xl font-bold transition-all duration-300 ${
                        priceChanged ? "scale-110" : "scale-100"
                      }`}
                      style={{ color: drop.theme.primaryColor }}
                    >
                      {formatPrice(selectedPrice.amount, selectedPrice.currency)}
                    </p>
                    <p className="text-xs opacity-75">{selectedPrice.variantLabel}</p>
                  </div>
                  <Button
                    onClick={handlePurchase}
                    disabled={!canPurchase}
                    className="px-6 lg:px-8 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                    style={{
                      backgroundColor: canPurchase ? drop.theme.primaryColor : "#6B7280",
                      color: drop.theme.backgroundColor,
                    }}
                  >
                    {!canPurchase && selectedPrice.metadata.stock === 0 ? "Sold Out" : "Buy Now"}
                  </Button>
                </div>
              ) : (
                <Button
                  disabled
                  className="px-6 lg:px-8 opacity-50 transition-all duration-200"
                  style={{
                    backgroundColor: drop.theme.primaryColor,
                    color: drop.theme.backgroundColor,
                  }}
                >
                  Select Options
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Flow Modal */}
      {showPurchaseFlow && selectedPrice && (
        <PurchaseFlow drop={drop} selectedPrice={selectedPrice} onClose={() => setShowPurchaseFlow(false)} />
      )}
    </>
  )
}
