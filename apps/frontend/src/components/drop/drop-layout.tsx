"use client"

import type React from "react"

import type { Drop } from "@/types/drop"

interface DropLayoutProps {
  drop: Drop
  children: React.ReactNode
}

export function DropLayout({ drop, children }: DropLayoutProps) {
  const { theme } = drop

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        color: theme.secondaryColor,
      }}
    >
      {/* Apply custom CSS if provided */}
      {theme.customCss && <style dangerouslySetInnerHTML={{ __html: theme.customCss }} />}

      <div className="relative">{children}</div>
    </div>
  )
}
