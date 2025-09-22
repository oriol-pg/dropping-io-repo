"use client"

import type React from "react"

import type { Drop } from "@/types/drop"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Icons } from "@workspace/ui/components/icons"
import { Input } from "@workspace/ui/components/input"
import { useEffect, useState } from "react"

interface DropComingSoonProps {
  drop: Drop
}

export function DropComingSoon({ drop }: DropComingSoonProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const launchTime = new Date(drop.launchAt).getTime()
      const difference = launchTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [drop.launchAt])

  const handleWaitlistSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
    }
  }

  const product = drop.products[0]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Creator Profile */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={drop.profile.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>{drop.profile.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{drop.profile.displayName}</h3>
              <Badge variant="secondary" className="text-xs">
                <Icons.LucideIcons.Users className="w-3 h-3 mr-1" />
                {drop.viewCount} watching
              </Badge>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">{drop.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{drop.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Product Preview */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.images[0] || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Badge className="px-4 py-2 text-lg">
                    <Icons.LucideIcons.Clock className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1, 4).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden opacity-75">
                  <img
                    src={image || "/placeholder.svg?height=200&width=200"}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Countdown and Waitlist */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-xl sm:text-2xl">Drops in</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="bg-muted rounded-lg p-2 sm:p-4">
                        <div className="text-xl sm:text-3xl font-bold">{value}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground capitalize">{unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icons.LucideIcons.Bell className="w-5 h-5 mr-2" />
                  Join the Waitlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isSubscribed ? (
                  <form onSubmit={handleWaitlistSignup} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full">
                      Get Notified When It Drops
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <Icons.LucideIcons.CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <div className="text-green-600 font-medium mb-2">You're on the list!</div>
                    <p className="text-sm text-muted-foreground">We'll notify you the moment this drop goes live.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Limited to:</span>
                    <span>{drop.maxPerCustomer} per customer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pricing:</span>
                    <span className="capitalize">{drop.pricingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available sizes:</span>
                    <span>{product.attributes.availableSizes.join(", ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Creator Stats */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>
            By <span className="font-medium text-foreground">{drop.profile.displayName}</span> •{" "}
            {drop.profile.totalDrops} drops • €{(drop.profile.totalRevenue / 100).toLocaleString()} total sales
          </p>
        </div>
      </div>
    </div>
  )
}
