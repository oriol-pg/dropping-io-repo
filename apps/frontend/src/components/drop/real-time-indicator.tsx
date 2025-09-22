"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Icons } from "@workspace/ui/components/icons"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"

interface RealTimeIndicatorProps {
  isConnected: boolean
  lastUpdate: Date | null
  className?: string
}

export function RealTimeIndicator({ isConnected, lastUpdate, className }: RealTimeIndicatorProps) {
  const [showPulse, setShowPulse] = useState(false)

  // Show pulse animation when data updates
  useEffect(() => {
    if (lastUpdate) {
      setShowPulse(true)
      const timeout = setTimeout(() => setShowPulse(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [lastUpdate])

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Never"
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className={cn(
          "flex items-center space-x-1 transition-all",
          showPulse && "animate-pulse",
          isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "",
        )}
      >
        {isConnected ? (
          <>
            <Icons.LucideIcons.Activity className="h-3 w-3" />
            <span>Live</span>
          </>
        ) : (
          <>
            <Icons.LucideIcons.WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </>
        )}
      </Badge>

      {lastUpdate && <span className="text-xs text-gray-500">Updated {getTimeAgo(lastUpdate)}</span>}
    </div>
  )
}
