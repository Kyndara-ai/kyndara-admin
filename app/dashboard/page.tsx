'use client'

import { useEffect, useState } from 'react'
import { fetchAnalytics } from '@/app/lib/api'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { ActivityChart } from '@/components/dashboard/activity-chart'
import { Spinner } from '@/components/ui/spinner'

interface AnalyticsData {
  totalUsers: number
  totalContent: number
  pendingApprovals: number
  verifiedPublishers: number
  monthlyGrowth: Array<{
    month: string
    users: number
  }>
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your content.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        totalUsers={analytics.totalUsers}
        totalContent={analytics.totalContent}
        pendingApprovals={analytics.pendingApprovals}
        verifiedPublishers={analytics.verifiedPublishers}
      />

      {/* Activity Chart */}
      <div className="grid grid-cols-1 gap-4">
        <ActivityChart data={analytics.monthlyGrowth} />
      </div>
    </div>
  )
}
