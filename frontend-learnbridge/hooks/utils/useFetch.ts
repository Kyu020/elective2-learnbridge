import { useState, useCallback } from 'react'

export interface UseFetchOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
}

export function useFetch<T>(fetcher: () => Promise<T>, options: UseFetchOptions<T> = {}) {
  const [data, setData] = useState<T | null>(options.initialData || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetcher()
      setData(result)
      options.onSuccess?.(result)
      return result
    } catch (err) {
      setError(err)
      options.onError?.(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetcher, options])

  return { data, loading, error, refetch: fetchData }
}