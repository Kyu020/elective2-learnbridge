// Authentication hooks
export { useAuth } from '@/contexts/authContext'
export { useUser } from './auth/useUser'

// Data fetching hooks
export { useDashboardData } from './data/useDashboard'
export { useBookings } from './data/useBookings'
export { useFavorites } from './data/useFavorites'
export { useResourcesData } from './data/useResources'
export { useTutorsData } from './data/useTutors'
export { useTutorProfile } from './data/useTutorProfile'

// UI hooks
export { useToast } from './ui/use-toast'
export { useToastNotifications } from './ui/useToastNotifications'
export { useSearch, useResourceSearch, useTutorSearch } from './ui/useSearch'
export { useUpload, useResourceUpload } from './ui/useUpload'

// Form hooks
export { useResourceForm } from './forms/useResourceForm'

// Utility hooks
export { useFetch } from './utils/useFetch'
export { useDebounce } from './utils/useDebounce'

// Navigation hooks
export { useFavoritesNavigation } from './navigation/useFavoritesNavigation'