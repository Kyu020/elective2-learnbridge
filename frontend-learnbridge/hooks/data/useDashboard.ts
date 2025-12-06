import { useState, useEffect } from "react"
import { dashboardService } from "@/services/dashboard.service"
import { DashboardData } from "@/interfaces/dashboard.interface"
import { useToast } from "@/hooks/ui/use-toast"

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData>({
        user: null,
        resources: [],
        tutors: [],
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const dashboardData = await dashboardService.fetchDashboardData()
            setData(dashboardData)
            
            toast({
                title: "Welcome back! 🎉",
                description: `Dashboard loaded successfully`,
            })
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
        fetchData()
    }, [])

    return {
        ...data,
        loading,
        error,
        refetch: fetchData,
    }
}