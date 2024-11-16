'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Eye } from "lucide-react"

// This would come from your API/database
const animals = [
  {
    id: "1",
    name: "Max",
    image: "/placeholder.svg?height=40&width=40",
    species: "Dog",
    breed: "German Shepherd",
    status: "Available",
    dateArrived: "2024-01-15",
  },
  {
    id: "2",
    name: "Luna",
    image: "/placeholder.svg?height=40&width=40",
    species: "Cat",
    breed: "Siamese",
    status: "Medical Check",
    dateArrived: "2024-01-20",
  },
  // Add more animals as needed
]

export function AnimalsList() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={animal.image} alt={animal.name} />
                  <AvatarFallback>{animal.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{animal.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {animal.species} • {animal.breed}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Arrived {animal.dateArrived}
                </div>
                <Badge variant={animal.status === "Available" ? "default" : "secondary"}>
                  {animal.status}
                </Badge>
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/animals/${animal.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 