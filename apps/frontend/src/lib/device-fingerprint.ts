export function generateDeviceFingerprint(): string {
  // In a real application, this would generate a more sophisticated fingerprint
  // based on browser characteristics, screen resolution, timezone, etc.
  const factors = [
    navigator.userAgent,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    navigator.language,
    navigator.platform,
  ]

  // Simple hash function for demo purposes
  let hash = 0
  const str = factors.join("|")
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

export function checkPurchaseLimit(fingerprint: string, maxPerCustomer: number): boolean {
  // In a real application, this would check against a database
  // For demo purposes, we'll simulate some existing purchases
  const existingPurchases = Math.floor(Math.random() * (maxPerCustomer + 1))
  return existingPurchases < maxPerCustomer
}
