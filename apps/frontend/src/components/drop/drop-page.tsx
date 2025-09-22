"use client"

import { DevControls } from "@/components/dev-controls"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCarousel } from "@/hooks/use-carousel"
import { useRealTimeDrop } from "@/hooks/use-real-time-drop"
import type { Drop, Price } from "@/types/drop"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Icons } from "@workspace/ui/components/icons"
import { useState } from "react"
import { DropArchived } from "./drop-archived"
import { DropComingSoon } from "./drop-coming-soon"
import { MagnifyingGlass } from "./magnifying-glass"
import { PurchaseFlow } from "./purchase-flow"

interface DropPageProps {
  drop: Drop
}

export function DropPage({ drop: initialDrop }: DropPageProps) {
  const { drop, isConnected } = useRealTimeDrop(initialDrop)
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null)
  const [devDropState, setDevDropState] = useState<"coming_soon" | "active" | "archived" | null>(null)
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const product = drop.products[0]
  const images = product?.images || []

  const {
    currentIndex: selectedImageIndex,
    isTransitioning,
    goToNext,
    goToPrevious,
    goToIndex,
    carouselRef,
    imageRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleKeyDown,
  } = useCarousel({
    items: images,
    initialIndex: 0,
    enableSwipe: true,
    enableKeyboard: true,
    enableZoom: false,
  })

  const now = new Date()
  const launchTime = new Date(drop.launchAt)
  const endTime = new Date(drop.endAt)

  let dropState: "coming_soon" | "active" | "archived"
  if (devDropState) {
    dropState = devDropState
  } else if (drop.status === "coming_soon" || now < launchTime) {
    dropState = "coming_soon"
  } else if (now > endTime || drop.status === "archived") {
    dropState = "archived"
  } else {
    dropState = "active"
  }

  const totalStock = product?.prices.reduce((sum, price) => sum + (price.metadata.stock as number), 0) || 0
  const initialStock = product?.prices.reduce((sum, price) => sum + ((price.metadata.stock as number) + 50), 0) || 0
  const soldStock = initialStock - totalStock
  const progressPercentage = initialStock > 0 ? (soldStock / initialStock) * 100 : 0

  const availableSizes = [...new Set(product?.prices.map((p) => p.variantAttributes.size) || [])]
  const availableColors = [...new Set(product?.prices.map((p) => p.variantAttributes.color) || [])]

  const matchingPrice = product?.prices.find(
    (p) => p.variantAttributes.size === selectedSize && p.variantAttributes.color === selectedColor,
  )

  if (matchingPrice && matchingPrice !== selectedPrice) {
    setSelectedPrice(matchingPrice)
  }

  const scrollToOptions = () => {
    const optionsElement = document.getElementById("options-selection")
    if (optionsElement) {
      optionsElement.scrollIntoView({ behavior: "smooth", block: "center" })
      optionsElement.classList.add("ring-2", "ring-primary", "ring-opacity-50")
      setTimeout(() => {
        optionsElement.classList.remove("ring-2", "ring-primary", "ring-opacity-50")
      }, 2000)
    }
  }

  if (dropState === "coming_soon") {
    return (
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        <DevControls onStateChange={setDevDropState} currentState={dropState} />
        <DropComingSoon drop={drop} />
      </div>
    )
  }

  if (dropState === "archived") {
    return (
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        <DevControls onStateChange={setDevDropState} currentState={dropState} />
        <DropArchived drop={drop} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <DevControls onStateChange={setDevDropState} currentState={dropState} />

      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <AvatarImage src={drop.profile.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback>{drop.profile.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-semibold truncate">{drop.profile.displayName}</h1>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <Icons.LucideIcons.Eye className="w-3 h-3" />
                  <span>{drop.viewCount} viewing</span>
                </div>
              </div>
              <Badge variant={isConnected ? "default" : "secondary"} className="hidden sm:flex">
                <Icons.LucideIcons.Zap className="w-3 h-3 mr-1" />
                {isConnected ? "Live" : "Offline"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {selectedPrice && (
                <div className="text-right hidden sm:block">
                  <div className="text-lg font-bold">€{(selectedPrice.amount / 100).toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{selectedPrice.variantLabel}</div>
                </div>
              )}
              <Button
                size="sm"
                onClick={() => {
                  if (!selectedPrice) {
                    scrollToOptions()
                  } else {
                    setShowPurchaseFlow(true)
                  }
                }}
                disabled={selectedPrice && selectedPrice.metadata.stock === 0 ? true : false}
                className="text-xs sm:text-sm"
              >
                {!selectedPrice ? "Select Options" : selectedPrice.metadata.stock === 0 ? "Sold Out" : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">{drop.title}</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">{drop.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Left Column - Product Images */}
          <div className="space-y-3">
            {/* Main Image with Magnifying Glass */}
            <div
              ref={carouselRef}
              className="aspect-square bg-muted rounded-lg overflow-hidden group relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <MagnifyingGlass
                imageSrc={images[selectedImageIndex] || "/placeholder.svg?height=600&width=600"}
                imageAlt={product?.name || "Product image"}
                zoomLevel={2.5}
                size={200}
              />

              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goToPrevious()
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <Icons.LucideIcons.ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goToNext()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <Icons.LucideIcons.ChevronRight className="w-3 h-3" />
                  </button>
                </>
              )}

              {/* Hover to zoom indicator */}
              {images.length > 0 && (
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  Hover to zoom
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goToIndex(index)
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary ring-1 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product?.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Options & Info */}
          <div className="space-y-4">
            {/* Product Title & Price */}
            <div>
              <h2 className="text-xl font-bold mb-1">{product?.name}</h2>
              {selectedPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">€{(selectedPrice.amount / 100).toFixed(2)}</span>
                  <Badge variant={selectedPrice.metadata.stock === 0 ? "destructive" : "secondary"} className="text-xs">
                    {selectedPrice.metadata.stock === 0 ? "Sold out" : `${selectedPrice.metadata.stock} left`}
                  </Badge>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Select options to see price</div>
              )}
            </div>

            {/* Product Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">{product?.description}</p>

            {/* Options Selection */}
            <div className="space-y-3">
              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-medium">Size</h3>
                  {selectedSize && <span className="text-xs text-muted-foreground">{selectedSize}</span>}
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {availableSizes.map((size) => {
                    const sizeVariants = product?.prices.filter((p) => p.variantAttributes.size === size) || []
                    const isAvailable = sizeVariants.some((v) => v.metadata.stock > 0)
                    const isSelected = selectedSize === size
                    const sizeStock = sizeVariants.reduce((sum, v) => sum + (v.metadata.stock as number), 0)

                    return (
                      <div key={size} className="relative">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedSize(size)
                            if (selectedColor && !product?.prices.find(p =>
                              p.variantAttributes.size === size && p.variantAttributes.color === selectedColor
                            )) {
                              setSelectedColor(null)
                            }
                          }}
                          disabled={!isAvailable}
                          className="w-full h-8 text-xs font-medium"
                        >
                          {size}
                        </Button>
                        {isAvailable && sizeStock <= 5 && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1 py-0 h-3 min-w-3">
                            {sizeStock}
                          </Badge>
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-background/80 rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground font-medium">Out</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-medium">Color</h3>
                  {selectedColor && (
                    <span className="text-xs text-muted-foreground capitalize">{selectedColor}</span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {availableColors.map((color) => {
                    const colorVariants = product?.prices.filter(p =>
                      p.variantAttributes.color === color &&
                      (!selectedSize || p.variantAttributes.size === selectedSize)
                    ) || []
                    const isAvailable = colorVariants.some((v) => v.metadata.stock > 0)
                    const isSelected = selectedColor === color
                    const colorStock = colorVariants.reduce((sum, v) => sum + (v.metadata.stock as number), 0)

                    return (
                      <div key={color} className="relative">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedColor(color)}
                          disabled={!isAvailable}
                          className="w-full h-8 text-xs font-medium capitalize"
                        >
                          {color}
                        </Button>
                        {isAvailable && colorStock <= 5 && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1 py-0 h-3 min-w-3">
                            {colorStock}
                          </Badge>
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-background/80 rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground font-medium">Out</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            {selectedPrice && (
              <Button
                size="lg"
                onClick={() => setShowPurchaseFlow(true)}
                disabled={selectedPrice.metadata.stock === 0}
                className="w-full h-10 text-sm font-medium"
              >
                {selectedPrice.metadata.stock === 0 ? "Sold Out" : "Add to Cart - €" + (selectedPrice.amount / 100).toFixed(2)}
              </Button>
            )}

            {/* Stock Indicator */}
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                {totalStock > 0 ? `${totalStock} items remaining` : "Sold out"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Sticky Stats Footer - Now for all screen sizes */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="container mx-auto px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Icons.LucideIcons.Eye className="w-3 h-3 mr-1" />
                  {drop.viewCount} viewing
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Icons.LucideIcons.ShoppingCart className="w-3 h-3 mr-1" />
                  {drop.orderCount} orders
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {Math.round(progressPercentage)}% sold
                </Badge>
                <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                  <Icons.LucideIcons.Zap className="w-3 h-3 mr-1" />
                  {isConnected ? "Live" : "Offline"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Flow Modal */}
        {showPurchaseFlow && selectedPrice && (
          <PurchaseFlow drop={drop} selectedPrice={selectedPrice} onClose={() => setShowPurchaseFlow(false)} />
        )}
      </div>
    </div>
  )
}
