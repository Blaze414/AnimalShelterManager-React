'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const revenueData = [
  { month: "Jan", donations: 4200, adoptions: 2400, expenses: 5600 },
  { month: "Feb", donations: 3800, adoptions: 2800, expenses: 5200 },
  { month: "Mar", donations: 5000, adoptions: 3200, expenses: 6100 },
  { month: "Apr", donations: 4800, adoptions: 2900, expenses: 5800 },
  { month: "May", donations: 5600, adoptions: 3600, expenses: 6400 },
  { month: "Jun", donations: 6200, adoptions: 3900, expenses: 7100 },
]

export function FinancialOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={revenueData}>
            <XAxis
              dataKey="month"
              stroke="#888888"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#888888"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Bar 
              name="Donations"
              dataKey="donations" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              name="Adoptions"
              dataKey="adoptions" 
              fill="hsl(var(--secondary))" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              name="Expenses"
              dataKey="expenses" 
              fill="hsl(var(--destructive))" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 