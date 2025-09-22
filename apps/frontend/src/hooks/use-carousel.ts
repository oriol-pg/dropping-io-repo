"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseCarouselOptions {
  items: any[]
  initialIndex?: number
  autoPlay?: boolean
  autoPlayInterval?: number
  enableSwipe?: boolean
  enableKeyboard?: boolean
  enableZoom?: boolean
}

interface UseCarouselReturn {
  currentIndex: number
  isZoomed: boolean
  isTransitioning: boolean
  goToNext: () => void
  goToPrevious: () => void
  goToIndex: (index: number) => void
  toggleZoom: () => void
  closeZoom: () => void
  carouselRef: React.RefObject<HTMLDivElement | null>
  imageRef: React.RefObject<HTMLImageElement | null>
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: (e: React.TouchEvent) => void
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseUp: (e: React.MouseEvent) => void
  handleMouseLeave: (e: React.MouseEvent) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  handleImageClick: () => void
}

export function useCarousel({
  items,
  initialIndex = 0,
  autoPlay = false,
  autoPlayInterval = 3000,
  enableSwipe = true,
  enableKeyboard = true,
  enableZoom = true,
}: UseCarouselOptions): UseCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [mouseStart, setMouseStart] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const carouselRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Navigation functions
  const goToNext = useCallback(() => {
    if (items.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % items.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [items.length])

  const goToPrevious = useCallback(() => {
    if (items.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [items.length])

  const goToIndex = useCallback((index: number) => {
    if (index < 0 || index >= items.length || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [items.length, currentIndex])

  // Zoom functions
  const toggleZoom = useCallback(() => {
    if (!enableZoom) return
    setIsZoomed((prev) => !prev)
  }, [enableZoom])

  const closeZoom = useCallback(() => {
    setIsZoomed(false)
  }, [])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableSwipe) return
    e.stopPropagation()
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setIsDragging(true)
  }, [enableSwipe])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableSwipe || !touchStart || !isDragging) return
    e.preventDefault()
    e.stopPropagation()
  }, [enableSwipe, touchStart, isDragging])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enableSwipe || !touchStart || !isDragging) return

    e.stopPropagation()
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const minSwipeDistance = 50

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }

    setTouchStart(null)
    setIsDragging(false)
  }, [enableSwipe, touchStart, isDragging, goToNext, goToPrevious])

  // Mouse handlers for desktop drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableSwipe) return
    // Only start dragging if it's not on a button or interactive element
    if ((e.target as HTMLElement).closest('button')) return
    e.stopPropagation()
    setMouseStart({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }, [enableSwipe])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableSwipe || !mouseStart || !isDragging) return
    e.preventDefault()
    e.stopPropagation()
  }, [enableSwipe, mouseStart, isDragging])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!enableSwipe || !mouseStart || !isDragging) return

    e.stopPropagation()
    const deltaX = e.clientX - mouseStart.x
    const deltaY = e.clientY - mouseStart.y
    const minSwipeDistance = 50

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }

    setMouseStart(null)
    setIsDragging(false)
  }, [enableSwipe, mouseStart, isDragging, goToNext, goToPrevious])

  const handleMouseLeave = useCallback(() => {
    setMouseStart(null)
    setIsDragging(false)
  }, [])

  // Keyboard handlers
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!enableKeyboard || isZoomed) return

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        goToPrevious()
        break
      case 'ArrowRight':
        e.preventDefault()
        goToNext()
        break
      case 'Escape':
        e.preventDefault()
        closeZoom()
        break
      case ' ':
        e.preventDefault()
        toggleZoom()
        break
    }
  }, [enableKeyboard, isZoomed, goToNext, goToPrevious, closeZoom, toggleZoom])

  // Image click handler
  const handleImageClick = useCallback(() => {
    if (enableZoom) {
      toggleZoom()
    }
  }, [enableZoom, toggleZoom])

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && items.length > 1 && !isZoomed) {
      autoPlayRef.current = setInterval(goToNext, autoPlayInterval)
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, items.length, isZoomed, goToNext, autoPlayInterval])

  // Close zoom on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        closeZoom()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isZoomed, closeZoom])

  // Prevent body scroll when zoomed
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isZoomed])

  return {
    currentIndex,
    isZoomed,
    isTransitioning,
    goToNext,
    goToPrevious,
    goToIndex,
    toggleZoom,
    closeZoom,
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
    handleImageClick,
  }
}
