import { useState, useEffect } from 'react'
import { Resource } from '@/interfaces/resource.interface'
import { Tutor } from '@/interfaces/tutor.interface'
import { useToast } from './use-toast'

interface SearchOptions<T> {
  data: T[]
  searchFields: (keyof T)[]
  filterFn?: (item: T, query: string) => boolean
}

export function useSearch<T>({ data, searchFields, filterFn }: SearchOptions<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<T[]>(data)
  const { toast } = useToast()

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(data)
      return
    }

    const filtered = data.filter(item => {
      if (filterFn) {
        return filterFn(item, searchQuery)
      }
      
      return searchFields.some(field => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(searchQuery.toLowerCase())
      })
    })
    
    setFilteredData(filtered)
    
    if (filtered.length === 0 && searchQuery) {
      toast({
        title: "No results found",
        description: `No items matching "${searchQuery}"`,
        variant: "default"
      })
    }
  }, [searchQuery, data, searchFields, filterFn, toast])

  const clearSearch = () => {
    setSearchQuery('')
    toast({
      title: "Search cleared",
      description: "Showing all items",
    })
  }

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
  })
}

// Tutor search hook
export const useTutorSearch = (tutors: Tutor[]) => {
  const [priceRange, setPriceRange] = useState('all')
  const { searchQuery, setSearchQuery, filteredData, clearSearch } = useSearch({
    data: tutors,
    searchFields: ['name', 'subjects'] as const,
    filterFn: (tutor, query) => {
      const matchesSearch =
        tutor.name.toLowerCase().includes(query.toLowerCase()) ||
        tutor.subjects.some(s => s.toLowerCase().includes(query.toLowerCase()))
      
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'low' && tutor.hourlyRate < 50) ||
        (priceRange === 'medium' && tutor.hourlyRate >= 50 && tutor.hourlyRate < 100) ||
        (priceRange === 'high' && tutor.hourlyRate >= 100)
      
      return matchesSearch && matchesPrice
    }
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