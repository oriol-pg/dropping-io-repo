"use client"

import type { Drop, Price } from "@/types/drop"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { Icons } from "@workspace/ui/components/icons"
import { useState } from "react"

interface PurchaseFlowProps {
  drop: Drop
  selectedPrice: Price
  onClose: () => void
}

type PurchaseState = "idle" | "validating" | "securing" | "processing" | "success" | "error"

export function PurchaseFlow({ drop, selectedPrice, onClose }: PurchaseFlowProps) {
  const [purchaseState, setPurchaseState] = useState<PurchaseState>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePurchase = async () => {
    try {
      setPurchaseState("validating")
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (selectedPrice.metadata.stock === 0) {
        throw new Error("This item is no longer available")
      }

      const existingPurchases = Math.floor(Math.random() * 3)
      if (existingPurchases >= drop.maxPerCustomer) {
        throw new Error(`Maximum ${drop.maxPerCustomer} items per customer`)
      }

      setPurchaseState("securing")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const reservationSuccess = Math.random() > 0.1
      if (!reservationSuccess) {
        throw new Error("Unable to secure item - please try again")
      }

      setPurchaseState("processing")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const paymentSuccess = Math.random() > 0.05
      if (!paymentSuccess) {
        throw new Error("Payment processing failed - please try again")
      }

      setPurchaseState("success")
      setTimeout(() => onClose(), 2000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      setPurchaseState("error")
    }
  }

  const getStateContent = () => {
    switch (purchaseState) {
      case "idle":
        return {
          title: "Confirm Purchase",
          content: (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{drop.products[0].name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedPrice.variantLabel}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">€{(selectedPrice.amount / 100).toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icons.LucideIcons.Shield className="h-4 w-4 text-green-500" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icons.LucideIcons.CreditCard className="h-4 w-4 text-blue-500" />
                  <span>All major payment methods accepted</span>
                </div>
              </div>

              <Alert>
                <Icons.LucideIcons.AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Limited to {drop.maxPerCustomer} items per customer. This item will be reserved for 15 minutes.
                </AlertDescription>
              </Alert>
            </div>
          ),
          actions: (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handlePurchase} className="flex-1">
                <Icons.LucideIcons.CreditCard className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </div>
          ),
        }

      case "validating":
        return {
          title: "Validating Purchase",
          content: (
            <div className="text-center py-8">
              <Icons.LucideIcons.Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Checking availability and purchase limits...</p>
            </div>
          ),
          actions: null,
        }

      case "securing":
        return {
          title: "Securing Your Item",
          content: (
            <div className="text-center py-8">
              <Icons.LucideIcons.Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="font-medium mb-2">Securing your item...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          ),
          actions: null,
        }

      case "processing":
        return {
          title: "Processing Payment",
          content: (
            <div className="text-center py-8">
              <Icons.LucideIcons.Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="font-medium mb-2">Processing your payment...</p>
              <p className="text-sm text-muted-foreground">Please do not close this window</p>
            </div>
          ),
          actions: null,
        }

      case "success":
        return {
          title: "Purchase Successful!",
          content: (
            <div className="text-center py-8">
              <Icons.LucideIcons.CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="font-medium mb-2">Your purchase was successful!</p>
              <p className="text-sm text-muted-foreground">You will receive a confirmation email shortly</p>
            </div>
          ),
          actions: null,
        }

      case "error":
        return {
          title: "Purchase Failed",
          content: (
            <div className="space-y-4">
              <Alert variant="destructive">
                <Icons.LucideIcons.AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground text-center">
                Please try again or contact support if the problem persists.
              </p>
            </div>
          ),
          actions: (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Close
              </Button>
              <Button
                onClick={() => {
                  setPurchaseState("idle")
                  setErrorMessage(null)
                }}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          ),
        }
    }
  }

  const { title, content, actions } = getStateContent()

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{content}</div>
        {actions && <div className="pt-4">{actions}</div>}
      </DialogContent>
    </Dialog>
  )
}
