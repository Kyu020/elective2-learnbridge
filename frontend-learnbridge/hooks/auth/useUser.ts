// hooks/auth/useUser.ts
import { useFetch } from '../utils/useFetch'
import { fetchCurrentUser, UserData } from '@/hooks/user' // Changed from '@/lib/api/user'

export function useUser() {
  return useFetch(fetchCurrentUser, {
    initialData: null
  })
}