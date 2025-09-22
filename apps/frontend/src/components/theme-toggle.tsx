"use client"

import { Button } from "@workspace/ui/components/button"
import { Icons } from "@workspace/ui/components/icons"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="fixed top-4 right-4 z-50 bg-transparent">
      {isDark ? <Icons.LucideIcons.Sun className="h-4 w-4" /> : <Icons.LucideIcons.Moon className="h-4 w-4" />}
    </Button>
  )
}
