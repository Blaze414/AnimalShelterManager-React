'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"

// This would come from your API/database
const medicalRecords = [
  {
    id: "1",
    animalId: "1",
    animalName: "Max",
    animalImage: "/placeholder.svg?height=40&width=40",
    procedure: "Vaccination",
    date: "2024-02-01",
    status: "Completed",
    veterinarian: "Dr. Smith",
    notes: "Annual vaccines updated",
  },
  {
    id: "2",
    animalId: "2",
    animalName: "Luna",
    animalImage: "/placeholder.svg?height=40&width=40",
    procedure: "Health Check",
    date: "2024-01-20",
    status: "Scheduled",
    veterinarian: "Dr. Johnson",
    notes: "Routine health assessment",
  },
  // Add more records as needed
]

export function MedicalRecords() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {medicalRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={record.animalImage} alt={record.animalName} />
                  <AvatarFallback>{record.animalName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{record.animalName}</div>
                  <div className="text-sm text-muted-foreground">
                    {record.procedure}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {record.veterinarian}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{record.date}</span>
                </div>
                <Badge variant={record.status === "Completed" ? "default" : "secondary"}>
                  {record.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 