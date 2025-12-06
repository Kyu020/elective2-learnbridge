// components/atoms/PriceDisplay.tsx
interface PriceDisplayProps {
  amount: number
  period?: "hour" | "session" | "month"
  size?: "sm" | "md" | "lg"
}

export function PriceDisplay({ amount, period = "hour", size = "md" }: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }
  
  return (
    <div className="flex items-baseline">
      <span className={`${sizeClasses[size]} font-bold`}>₱{amount.toLocaleString()}</span>
      <span className="text-sm text-muted-foreground ml-1">/{period}</span>
    </div>
  )
}