'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// This would come from your API/database
const budgetItems = [
  {
    id: "1",
    category: "Medical Supplies",
    allocated: 5000,
    spent: 3200,
    remaining: 1800,
  },
  {
    id: "2",
    category: "Pet Food",
    allocated: 3000,
    spent: 2100,
    remaining: 900,
  },
  {
    id: "3",
    category: "Staff Salaries",
    allocated: 8000,
    spent: 6000,
    remaining: 2000,
  },
  {
    id: "4",
    category: "Facility Maintenance",
    allocated: 2000,
    spent: 800,
    remaining: 1200,
  },
]

export function Budget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgetItems.map((item) => {
            const percentage = (item.spent / item.allocated) * 100
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.category}</div>
                  <div className="text-sm text-muted-foreground">
                    ${item.spent} / ${item.allocated}
                  </div>
                </div>
                <Progress value={percentage} />
                <div className="text-sm text-muted-foreground">
                  ${item.remaining} remaining
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 