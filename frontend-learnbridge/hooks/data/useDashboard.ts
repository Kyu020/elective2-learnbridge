import { useState, useEffect, useRef } from "react"
import { dashboardService } from "@/services/dashboard.service"
import { DashboardData } from "@/interfaces/dashboard.interface"
import { useToast } from "@/hooks/ui/use-toast"

export const useDashboardData = (initialData?: DashboardData | null) => {
    const [data, setData] = useState<DashboardData>(initialData || {
        user: null,
        resources: [],
        tutors: [],
    })
    const [loading, setLoading] = useState(!initialData)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const hasInitialized = useRef(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const dashboardData = await dashboardService.fetchDashboardData()
            setData(dashboardData)
            
            // Only show toast if data was actually fetched (not from initial data)
            if (!initialData) {
            toast({
                title: "Welcome back! 🎉",
                description: `Dashboard loaded successfully`,
            })
            }
        } catch (err: any) {
            console.error("❌ Fetch error:", err)
            setError(err.message || "Failed to load dashboard data")
            toast({
                title: "Error loading dashboard",
                description: err.message || "Failed to load your data",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Only fetch if we don't have initial data and haven't initialized yet
        if (!initialData && !hasInitialized.current) {
            hasInitialized.current = true
        fetchData()
        } else if (initialData) {
            // If we have initial data, we're already initialized
            hasInitialized.current = true
            setLoading(false)
        }
    }, []) // Empty deps - only run once on mount

    return {
        ...data,
        loading,
        error,
        refetch: fetchData,
    }
}