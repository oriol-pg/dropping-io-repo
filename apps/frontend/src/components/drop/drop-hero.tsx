"use client"

import { getTimeRemaining } from "@/lib/utils/drop-utils"
import type { Drop } from "@/types/drop"
import { Badge } from "@workspace/ui/components/badge"
import { Icons } from "@workspace/ui/components/icons"
import { useEffect, useState } from "react"

interface DropHeroProps {
  drop: Drop
}

export function DropHero({ drop }: DropHeroProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(drop.endAt))
  const [isCountdownPulsing, setIsCountdownPulsing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getTimeRemaining(drop.endAt)
      setTimeRemaining(newTime)

      if (newTime.hours === 0 && newTime.minutes < 10) {
        setIsCountdownPulsing(true)
        setTimeout(() => setIsCountdownPulsing(false), 500)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [drop.endAt])

  const getStatusBadge = () => {
    switch (drop.status) {
      case "coming_soon":
        return <Badge variant="secondary">Coming Soon</Badge>
      case "active":
        return (
          <Badge style={{ backgroundColor: drop.theme.primaryColor, color: drop.theme.backgroundColor }}>
            Live Now
          </Badge>
        )
      case "archived":
        return <Badge variant="outline">Ended</Badge>
    }
  }

  const formatTime = (value: number) => value.toString().padStart(2, "0")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="animate-in slide-in-from-left-5 duration-500">{getStatusBadge()}</div>
        {drop.pricingType !== "fixed" && (
          <div className="animate-in slide-in-from-right-5 duration-500 delay-100">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Icons.LucideIcons.TrendingUp className="h-3 w-3" />
              <span className="capitalize">{drop.pricingType} Pricing</span>
            </Badge>
          </div>
        )}
      </div>

      <div>
        <h1
          className="drop-title text-4xl lg:text-6xl font-bold mb-4 text-balance animate-in slide-in-from-bottom-8 duration-700"
          style={{ color: drop.theme.primaryColor }}
        >
          {drop.title}
        </h1>
        <p
          className="text-lg lg:text-xl opacity-90 max-w-2xl text-pretty animate-in slide-in-from-bottom-6 duration-700 delay-200"
          style={{ color: drop.theme.secondaryColor }}
        >
          {drop.description}
        </p>
      </div>

      {drop.status === "active" && !timeRemaining.isExpired && (
        <div
          className={`flex items-center space-x-4 p-4 rounded-lg border transition-all animate-in slide-in-from-bottom-4 duration-700 delay-300 ${
            isCountdownPulsing ? "scale-105 shadow-lg" : ""
          }`}
          style={{
            borderColor: drop.theme.primaryColor + "40",
            boxShadow:
              timeRemaining.hours === 0 && timeRemaining.minutes < 10
                ? `0 0 20px ${drop.theme.primaryColor}30`
                : "none",
          }}
        >
          <Icons.LucideIcons.Clock className="h-5 w-5" style={{ color: drop.theme.primaryColor }} />
          <div>
            <p className="text-sm opacity-75 mb-1">Time Remaining</p>
            <div
              className={`countdown text-2xl font-mono font-bold transition-all duration-300 ${
                timeRemaining.hours === 0 && timeRemaining.minutes < 10 ? "animate-pulse" : ""
              }`}
              style={{ color: drop.theme.primaryColor }}
            >
              <span className="inline-block transition-transform duration-300 hover:scale-110">
                {formatTime(timeRemaining.hours)}
              </span>
              :
              <span className="inline-block transition-transform duration-300 hover:scale-110">
                {formatTime(timeRemaining.minutes)}
              </span>
              :
              <span className="inline-block transition-transform duration-300 hover:scale-110">
                {formatTime(timeRemaining.seconds)}
              </span>
            </div>
          </div>
        </div>
      )}

      {timeRemaining.isExpired && drop.status === "active" && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 animate-in slide-in-from-bottom-4 duration-500">
          <p className="text-red-400 font-medium">This drop has ended</p>
        </div>
      )}
    </div>
  )
}
