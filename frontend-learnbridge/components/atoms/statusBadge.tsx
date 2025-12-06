// components/atoms/StatusBadge.tsx
import { Badge } from "@/components/ui/badge"
import { Check, Clock, X, Calendar, Slash } from "lucide-react"

type StatusType = "pending" | "accepted" | "completed" | "rejected" | "cancelled"

interface StatusBadgeProps {
  status: StatusType
  size?: "sm" | "md" | "lg"
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const statusConfig = {
    pending: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: <Clock className="h-3 w-3" /> 
    },
    accepted: { 
      color: "bg-green-100 text-green-800 border-green-200", 
      icon: <Check className="h-3 w-3" /> 
    },
    completed: { 
      color: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: <Check className="h-3 w-3" /> 
    },
    rejected: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      icon: <X className="h-3 w-3" /> 
    },
    cancelled: { 
      color: "bg-gray-100 text-gray-800 border-gray-200", 
      icon: <Slash className="h-3 w-3" /> 
    },
  }

  const config = statusConfig[status]
  
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      <span className="capitalize">{status}</span>
    </Badge>
  )
}