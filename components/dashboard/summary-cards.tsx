import { Users, FileText, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SummaryCardsProps {
  totalUsers: number
  totalContent: number
  pendingApprovals: number
  verifiedPublishers: number
}

const metrics = [
  {
    title: 'Total Users',
    value: 'totalUsers',
    icon: Users,
    color: 'text-primary',
  },
  {
    title: 'Published Content',
    value: 'totalContent',
    icon: FileText,
    color: 'text-blue-500',
  },
  {
    title: 'Pending Approvals',
    value: 'pendingApprovals',
    icon: Clock,
    color: 'text-yellow-500',
  },
  {
    title: 'Verified Publishers',
    value: 'verifiedPublishers',
    icon: CheckCircle,
    color: 'text-green-500',
  },
]

export function SummaryCards({
  totalUsers,
  totalContent,
  pendingApprovals,
  verifiedPublishers,
}: SummaryCardsProps) {
  const data = {
    totalUsers,
    totalContent,
    pendingApprovals,
    verifiedPublishers,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const value = data[metric.value as keyof typeof data]

        return (
          <Card key={metric.title} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Updated today
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
