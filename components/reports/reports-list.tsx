'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

// This would come from your API/database
const reports = [
  {
    id: "1",
    title: "Monthly Animal Statistics",
    type: "Statistics",
    date: "2024-02-01",
    status: "Ready",
    format: "PDF",
  },
  {
    id: "2",
    title: "Q4 2023 Financial Report",
    type: "Financial",
    date: "2024-01-15",
    status: "Ready",
    format: "Excel",
  },
  {
    id: "3",
    title: "Annual Medical Summary",
    type: "Medical",
    date: "2024-01-10",
    status: "Processing",
    format: "PDF",
  },
  {
    id: "4",
    title: "Staff Performance Review",
    type: "HR",
    date: "2024-01-05",
    status: "Ready",
    format: "PDF",
  },
]

export function ReportsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-full">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{report.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {report.type} • {report.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={report.status === "Ready" ? "default" : "secondary"}>
                  {report.status}
                </Badge>
                <Badge variant="outline">{report.format}</Badge>
                {report.status === "Ready" && (
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 