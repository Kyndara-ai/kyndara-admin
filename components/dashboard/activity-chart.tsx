'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface ActivityChartProps {
  data: Array<{
    month: string
    users: number
  }>
}

const chartConfig = {
  users: {
    label: 'Total Users',
    color: '#4A675A',
  },
} satisfies ChartConfig

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="rounded-2xl bg-[#F2EFE9] dark:bg-card p-6 shadow-sm border border-transparent dark:border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#312E26] dark:text-foreground">
          User Growth
        </h2>
        
        <div className="px-3 py-1.5 bg-white dark:bg-background rounded-lg shadow-sm text-xs font-bold text-[#8A857D] dark:text-muted-foreground flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
          This Year
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="w-full h-55">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} className="stroke-[#E1EAD8] dark:stroke-muted" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fill: '#8A857D', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              allowDecimals={false}
              tick={{ fill: '#8A857D', fontSize: 12, fontWeight: 500 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />} 
            />
            <Line
              type="linear"
              dataKey="users"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: 'var(--color-users)',
              }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}