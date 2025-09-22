"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Icons } from "@workspace/ui/components/icons"
import { useState } from "react"

interface DevControlsProps {
  onStateChange: (state: "coming_soon" | "active" | "archived") => void
  currentState: "coming_soon" | "active" | "archived"
}

export function DevControls({ onStateChange, currentState }: DevControlsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <Card className="mb-4 w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Dev Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Drop State:</p>
              <div className="flex flex-col gap-1">
                {["coming_soon", "active", "archived"].map((state) => (
                  <Button
                    key={state}
                    variant={currentState === state ? "default" : "outline"}
                    size="sm"
                    onClick={() => onStateChange(state as any)}
                    className="justify-start text-xs"
                  >
                    {state.replace("_", " ").toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Button onClick={() => setIsOpen(!isOpen)} size="icon" variant="outline" className="rounded-full shadow-lg">
        <Icons.LucideIcons.Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}
