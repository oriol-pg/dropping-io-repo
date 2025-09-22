"use client"

import { useEffect, useRef, useState } from "react"

interface MagnifyingGlassProps {
  imageSrc: string
  imageAlt: string
  zoomLevel?: number
  size?: number
}

export function MagnifyingGlass({
  imageSrc,
  imageAlt,
  zoomLevel = 2,
  size = 150
}: MagnifyingGlassProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const magnifierRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(true)
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const constrainedX = Math.max(0, Math.min(x, rect.width))
    const constrainedY = Math.max(0, Math.min(y, rect.height))
    setMousePosition({ x: constrainedX, y: constrainedY })
    setPosition({ x: constrainedX, y: constrainedY })
  }

  // Track container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const backgroundPosition = `${-mousePosition.x * zoomLevel + size / 2}px ${-mousePosition.y * zoomLevel + size / 2}px`

  const backgroundSize = `${containerSize.width * zoomLevel}px ${containerSize.height * zoomLevel}px`

  const magnifierStyle = {
    left: Math.max(0, Math.min(position.x - size / 2, containerSize.width - size)),
    top: Math.max(0, Math.min(position.y - size / 2, containerSize.height - size)),
    width: size,
    height: size,
    backgroundImage: `url(${imageSrc})`,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat: 'no-repeat' as const,
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Original Image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Magnifying Glass */}
      {isVisible && (
        <div
          ref={magnifierRef}
          className="absolute pointer-events-none border-2 border-white rounded-full shadow-lg z-30"
          style={magnifierStyle}
        />
      )}

      {/* Overlay to show magnified area */}
      {isVisible && (
        <div
          className="absolute inset-0 bg-black/10 pointer-events-none z-20"
          style={{
            background: `radial-gradient(circle ${size / 2}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.15) 41%)`
          }}
        />
      )}
    </div>
  )
}
