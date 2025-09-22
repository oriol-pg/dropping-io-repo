"use client"

import { Button } from "@workspace/ui/components/button"
import { Icons } from "@workspace/ui/components/icons"
import { useEffect } from "react"

interface ImageZoomModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
  onNext: () => void
  onPrevious: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  hasNext: boolean
  hasPrevious: boolean
}

export function ImageZoomModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  onNext,
  onPrevious,
  onKeyDown,
  hasNext,
  hasPrevious,
}: ImageZoomModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
      >
        <Icons.LucideIcons.X className="w-4 h-4" />
      </Button>

      {/* Navigation Arrows */}
      {hasPrevious && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
        >
          <Icons.LucideIcons.ChevronLeft className="w-6 h-6" />
        </Button>
      )}

      {hasNext && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
        >
          <Icons.LucideIcons.ChevronRight className="w-6 h-6" />
        </Button>
      )}

      {/* Image Container */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center">
        <p>Use arrow keys or swipe to navigate • Press ESC or click outside to close</p>
      </div>
    </div>
  )
}
