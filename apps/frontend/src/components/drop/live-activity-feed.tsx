"use client"

import type { Theme } from "@/types/drop";
import { Badge } from "@workspace/ui/components/badge";
import { Icons } from "@workspace/ui/components/icons";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils"; // Fixed import path to use correct utils location
import { useEffect, useState } from "react";

interface ActivityItem {
  id: string
  type: "purchase" | "view" | "milestone"
  message: string
  timestamp: Date
  variant?: string
}

interface LiveActivityFeedProps {
  viewCount: number
  orderCount: number
  className?: string
  theme?: Theme
}

export function LiveActivityFeed({ viewCount, orderCount, className, theme }: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [newActivityId, setNewActivityId] = useState<string | null>(null)

  useEffect(() => {
    const generateActivity = () => {
      const activityTypes = [
        {
          type: "purchase" as const,
          messages: [
            "Someone just bought a Black - M",
            "White - L was purchased",
            "Gray - L just sold",
            "Black - L was added to cart",
          ],
        },
        {
          type: "view" as const,
          messages: [
            "New visitor from New York",
            "Someone is viewing from London",
            "Visitor from Tokyo joined",
            "New viewer from Berlin",
          ],
        },
      ]

      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)]

      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: randomType.type,
        message: randomMessage,
        timestamp: new Date(),
      }

      setNewActivityId(newActivity.id)
      setTimeout(() => setNewActivityId(null), 1000)

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]) // Keep last 10 activities
    }

    const initialActivities = Array.from({ length: 5 }, (_, i) => ({
      id: `initial-${i}`,
      type: Math.random() > 0.5 ? ("purchase" as const) : ("view" as const),
      message: Math.random() > 0.5 ? "Someone just bought a Black - M" : "New visitor from Paris",
      timestamp: new Date(Date.now() - i * 30000), // 30 seconds apart
    }))
    setActivities(initialActivities)

    const interval = setInterval(generateActivity, 8000 + Math.random() * 12000) // 8-20 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const milestones = [25, 50, 75, 100]
    const milestone = milestones.find((m) => orderCount >= m && orderCount < m + 5)

    if (milestone) {
      const milestoneActivity: ActivityItem = {
        id: `milestone-${milestone}`,
        type: "milestone",
        message: `🎉 ${milestone} items sold!`,
        timestamp: new Date(),
      }

      setActivities((prev) => [milestoneActivity, ...prev.slice(0, 9)])
    }
  }, [orderCount])

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "purchase":
        return <Icons.LucideIcons.ShoppingCart className="h-3 w-3" style={{ color: theme?.primaryColor || "#10b981" }} />
      case "view":
        return <Icons.LucideIcons.Eye className="h-3 w-3" style={{ color: theme?.secondaryColor || "#3b82f6" }} />
      case "milestone":
        return <Icons.LucideIcons.TrendingUp className="h-3 w-3" style={{ color: theme?.primaryColor || "#8b5cf6" }} />
    }
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h`
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium" style={{ color: theme?.primaryColor || "#ffffff" }}>
          Live Activity
        </h3>
        <Badge variant="outline" className="text-xs animate-pulse">
          {viewCount} viewing
        </Badge>
      </div>

      <ScrollArea className="h-48">
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start space-x-2 p-2 rounded-md border transition-all duration-300",
                newActivityId === activity.id && "animate-in slide-in-from-top-2 duration-500",
                index === 0 && "hover:scale-105",
              )}
              style={{
                backgroundColor: theme?.backgroundColor ? `${theme.backgroundColor}20` : "rgba(17, 24, 39, 0.3)",
                borderColor: theme?.secondaryColor ? `${theme.secondaryColor}50` : "rgba(107, 114, 128, 0.5)",
                boxShadow: newActivityId === activity.id ? `0 0 10px ${theme?.primaryColor || "#8b5cf6"}30` : "none",
              }}
            >
              <div className="transition-transform duration-200 hover:scale-110">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate" style={{ color: theme?.secondaryColor || "#d1d5db" }}>
                  {activity.message}
                </p>
                <p
                  className="text-xs"
                  style={{ color: theme?.secondaryColor ? `${theme.secondaryColor}80` : "#9ca3af" }}
                >
                  {getTimeAgo(activity.timestamp)} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
