// components/atoms/RatingDisplay.tsx
import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  count?: number
  size?: "sm" | "md" | "lg"
}

export function RatingDisplay({ rating, count, size = "md" }: RatingDisplayProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }
  
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize[size]} ${
              star <= Math.round(rating)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className={`${sizeClasses[size]} font-semibold`}>{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className={`${sizeClasses[size]} text-muted-foreground`}>
          ({count})
        </span>
      )}
    </div>
  )
}