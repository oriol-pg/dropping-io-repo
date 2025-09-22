"use client"

import type { Product } from "@/types/drop"
import { Button } from "@workspace/ui/components/button"
import { Icons } from "@workspace/ui/components/icons"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"

interface ProductGalleryProps {
  product: Product
  selectedImageIndex: number
  onImageSelect: (index: number) => void
}

export function ProductGallery({ product, selectedImageIndex, onImageSelect }: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const images = [
    "/vintage-black-band-t-shirt-90s.jpg",
    "/vintage-white-band-t-shirt-90s.jpg",
    "/vintage-gray-band-t-shirt-90s.jpg",
  ]

  const nextImage = () => {
    onImageSelect((selectedImageIndex + 1) % images.length)
  }

  const prevImage = () => {
    onImageSelect(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1)
  }

  const handleImageSelect = (index: number) => {
    if (index !== selectedImageIndex) {
      setIsImageLoading(true)
      setTimeout(() => {
        onImageSelect(index)
        setIsImageLoading(false)
      }, 150) // Brief delay for smooth transition
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div
          className={cn(
            "relative aspect-square rounded-lg overflow-hidden bg-gray-100 transition-all duration-300",
            isZoomed && "cursor-zoom-out",
            isImageLoading && "opacity-75",
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {isImageLoading && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
              <Icons.LucideIcons.Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}

          <img
            src={images[selectedImageIndex] || "/placeholder.svg"}
            alt={`${product.name} - Image ${selectedImageIndex + 1}`}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isZoomed ? "scale-150" : "scale-100 hover:scale-105",
              isImageLoading ? "opacity-0" : "opacity-100",
            )}
            onLoad={() => setIsImageLoading(false)}
          />

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
            <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
              <Icons.LucideIcons.ZoomIn className="h-4 w-4 text-white" />
            </div>
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <Icons.LucideIcons.ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <Icons.LucideIcons.ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm backdrop-blur-sm transition-all duration-300 hover:bg-black/70">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 hover:scale-105",
                selectedImageIndex === index
                  ? "border-purple-600 ring-2 ring-purple-600/20 scale-105"
                  : "border-gray-300 hover:border-gray-400",
              )}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
              />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="text-2xl font-bold text-white">{product.name}</h2>
        <p className="text-gray-300">{product.description}</p>
      </div>
    </div>
  )
}
