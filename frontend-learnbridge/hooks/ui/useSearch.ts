import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Resource } from '@/interfaces/resource.interface'
import { Tutor } from '@/interfaces/tutor.interface'
import { useToast } from './use-toast'

interface SearchOptions<T> {
  data: T[]
  searchFields: (keyof T)[]
  filterFn?: (item: T, query: string) => boolean
  debounceMs?: number
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useSearch<T>({ data, searchFields, filterFn, debounceMs = 300 }: SearchOptions<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  const toastShownRef = useRef<string>('')
  
  // Ensure data is always an array
  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data])
  
  // Debounce search query to avoid excessive filtering
  const debouncedQuery = useDebounce(searchQuery.trim(), debounceMs)

  // Memoize filtered results for performance
  const filteredData = useMemo(() => {
    if (debouncedQuery === '') {
      return safeData
    }

    try {
      return safeData.filter(item => {
        if (!item) return false
        
        if (filterFn) {
          return filterFn(item, debouncedQuery)
        }
        
        return searchFields.some(field => {
          const value = item[field]
          if (value === null || value === undefined) return false
          
          // Handle arrays (like subjects/course)
          if (Array.isArray(value)) {
            return value.some(v => 
              v && String(v).toLowerCase().includes(debouncedQuery.toLowerCase())
            )
          }
          
          return String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
        })
      })
    } catch (error) {
      console.error('Search filter error:', error)
      return safeData
    }
  }, [debouncedQuery, safeData, searchFields, filterFn])

  // Handle toast notifications separately to avoid render issues
  useEffect(() => {
    if (filteredData.length === 0 && debouncedQuery && toastShownRef.current !== debouncedQuery) {
      toastShownRef.current = debouncedQuery
      // Only show toast for queries with 3+ characters to avoid spam
      if (debouncedQuery.length >= 3) {
        toast({
          title: "No results found",
          description: `No items matching "${debouncedQuery}"`,
          variant: "default"
        })
      }
    } else if (filteredData.length > 0) {
      // Reset toast ref when results are found
      toastShownRef.current = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData.length, debouncedQuery])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    toastShownRef.current = ''
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    clearSearch,
  }
}

// Resource search hook
export const useResourceSearch = (resources: Resource[]) => {
  return useSearch({
    data: resources,
    searchFields: ['title', 'course', 'uploader', 'uploaderName'] as const,
    debounceMs: 300,
  })
}

// Tutor search hook
export const useTutorSearch = (tutors: Tutor[]) => {
  const [priceRange, setPriceRange] = useState('all')
  
  // Memoize filter function to prevent recreation on every render
  const filterFn = useCallback((tutor: Tutor, query: string) => {
    if (!tutor) return false
    
    const lowerQuery = query.toLowerCase()
    const courses = tutor.course || [];
    const tutorName = tutor.name || ''
    
    const matchesSearch =
      tutorName.toLowerCase().includes(lowerQuery) ||
      courses.some(s => s && String(s).toLowerCase().includes(lowerQuery))
    
    const matchesPrice =
      priceRange === 'all' ||
      (priceRange === 'low' && (tutor.hourlyRate || 0) < 50) ||
      (priceRange === 'medium' && (tutor.hourlyRate || 0) >= 50 && (tutor.hourlyRate || 0) < 100) ||
      (priceRange === 'high' && (tutor.hourlyRate || 0) >= 100)
    
    return matchesSearch && matchesPrice
  }, [priceRange])
  
  const { searchQuery, setSearchQuery, filteredData, clearSearch } = useSearch({
    data: tutors,
    searchFields: ['name', 'course'] as const,
    debounceMs: 300,
    filterFn
  })

  return {
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    filteredTutors: filteredData,
    clearFilters: () => {
      clearSearch()
      setPriceRange('all')
    }
  }
}