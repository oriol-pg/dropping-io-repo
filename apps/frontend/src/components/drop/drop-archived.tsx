"use client"

import type { Drop } from "@/types/drop"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Icons } from "@workspace/ui/components/icons"

interface DropArchivedProps {
  drop: Drop
}

export function DropArchived({ drop }: DropArchivedProps) {
  const product = drop.products[0]
  const soldOutVariants = product.prices.filter((p) => p.metadata.stock === 0).length
  const totalVariants = product.prices.length
  const sellThroughRate = Math.round((soldOutVariants / totalVariants) * 100)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={drop.profile.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>{drop.profile.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{drop.profile.displayName}</h3>
              <Badge variant="outline">Drop Ended</Badge>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">{drop.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">{drop.description}</p>

          <Badge className="px-4 py-2 text-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Icons.LucideIcons.CheckCircle className="w-4 h-4 mr-2" />
            Drop Completed
          </Badge>
        </div>

        {/* Results Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Icons.LucideIcons.TrendingUp className="w-8 h-8 text-primary" />
                <Badge variant="secondary">{sellThroughRate}% sold</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">€{(drop.revenueTotal / 100).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Icons.LucideIcons.Users className="w-8 h-8 text-primary" />
                <Badge variant="secondary">{drop.orderCount} orders</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{drop.viewCount}</div>
              <div className="text-sm text-muted-foreground">Peak Viewers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Icons.LucideIcons.Clock className="w-8 h-8 text-primary" />
                <Badge variant="secondary">
                  {Math.round((new Date(drop.endAt).getTime() - new Date(drop.launchAt).getTime()) / (1000 * 60 * 60))}h
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">
                {soldOutVariants}/{totalVariants}
              </div>
              <div className="text-sm text-muted-foreground">Variants Sold Out</div>
            </CardContent>
          </Card>
        </div>

        {/* Product Gallery and Details */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square">
                <img
                  src={product.images[0] || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg?height=200&width=200"}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Final Stock Status */}
            <Card>
              <CardHeader>
                <CardTitle>Final Stock Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.prices.map((price) => {
                    const stock = price.metadata.stock
                    return (
                      <div key={price.id} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{price.variantLabel}</span>
                        <Badge variant={stock === 0 ? "destructive" : "secondary"}>
                          {stock === 0 ? "Sold Out" : `${stock} left`}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Follow Creator */}
            <Card>
              <CardHeader>
                <CardTitle>Don't miss the next drop</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow {drop.profile.displayName} to get notified about future drops
                </p>
                <Button className="w-full">Follow {drop.profile.displayName}</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Drop Timeline */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Drop Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Launched:</span>
                <span>{new Date(drop.launchAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ended:</span>
                <span>{new Date(drop.endAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>
                  {Math.round((new Date(drop.endAt).getTime() - new Date(drop.launchAt).getTime()) / (1000 * 60 * 60))}{" "}
                  hours
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
