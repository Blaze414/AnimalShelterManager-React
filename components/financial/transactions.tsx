'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

// This would come from your API/database
const transactions = [
  {
    id: "1",
    description: "Donation from John Doe",
    amount: 500,
    type: "Income",
    category: "Donation",
    date: "2024-02-01",
  },
  {
    id: "2",
    description: "Medical Supplies",
    amount: 250,
    type: "Expense",
    category: "Medical",
    date: "2024-02-01",
  },
  {
    id: "3",
    description: "Adoption Fee - Max",
    amount: 150,
    type: "Income",
    category: "Adoption",
    date: "2024-01-31",
  },
  {
    id: "4",
    description: "Pet Food Supply",
    amount: 400,
    type: "Expense",
    category: "Supplies",
    date: "2024-01-30",
  },
]

export function Transactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-full">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.category} • {transaction.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`font-medium ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'Income' ? '+' : '-'}${transaction.amount}
                </div>
                <Badge variant={transaction.type === "Income" ? "default" : "destructive"}>
                  {transaction.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 