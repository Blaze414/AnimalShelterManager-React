'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Heart, Pencil, Share2, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// This would come from your API/database
const animalData = {
  "1": {
    id: "1",
    name: "Max",
    species: "Dog",
    breed: "German Shepherd",
    age: "3 years",
    gender: "Male",
    status: "Available",
    weight: "30 kg",
    dateArrived: "2024-01-15",
    description: "Max is a friendly and energetic German Shepherd who loves to play and learn new tricks. He's great with children and other dogs.",
    medicalHistory: [
      { date: "2024-02-01", procedure: "Vaccination", notes: "Annual vaccines updated" },
      { date: "2024-01-16", procedure: "Health Check", notes: "General health assessment upon arrival" }
    ],
    behavior: "Friendly, Active, Trained",
    images: ["/placeholder.svg?height=400&width=600"]
  },
  "2": {
    id: "2",
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    age: "2 years",
    gender: "Female",
    status: "Medical Check",
    weight: "4 kg",
    dateArrived: "2024-01-20",
    description: "Luna is a graceful Siamese cat with a gentle personality. She enjoys quiet environments and loves to cuddle.",
    medicalHistory: [
      { date: "2024-01-20", procedure: "Initial Check-up", notes: "Overall health assessment" },
      { date: "2024-01-25", procedure: "Dental Cleaning", notes: "Routine dental maintenance" }
    ],
    behavior: "Gentle, Quiet, Independent",
    images: ["/placeholder.svg?height=400&width=600"]
  }
}

export function AnimalDetails({ id }: { id: string }) {
  const animal = animalData[id as keyof typeof animalData]

  if (!animal) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Animal not found
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={animal.images[0]}
                alt={animal.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <Button asChild>
                <Link href={`/animals/${animal.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{animal.name}</CardTitle>
              <Badge variant={animal.status === "Available" ? "default" : "secondary"}>
                {animal.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Species</div>
                  <div className="font-medium">{animal.species}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Breed</div>
                  <div className="font-medium">{animal.breed}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Age</div>
                  <div className="font-medium">{animal.age}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Gender</div>
                  <div className="font-medium">{animal.gender}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Weight</div>
                  <div className="font-medium">{animal.weight}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Behavior</div>
                  <div className="font-medium">{animal.behavior}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Arrived {animal.dateArrived}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>ID: {animal.id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About {animal.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{animal.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {animal.medicalHistory.map((record, index) => (
                  <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <div className="font-medium">{record.procedure}</div>
                      <div className="text-sm text-muted-foreground">{record.date}</div>
                      <div className="text-sm">{record.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No notes available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 