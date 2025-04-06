'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Eye } from "lucide-react"

// Define the type for an animal
interface Animal {
  _id: string;
  name: string;
  species: string;
  breed: string;
  status: string;
  dateArrived: string;
}

export function AnimalsList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('/api/animals');
        if (!response.ok) {
          throw new Error('Failed to fetch animals');
        }
        const data = await response.json();
        setAnimals(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div>
      {animals.map((animal) => (
        <Card key={animal._id} className="mb-4">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={animal.name} />
                <AvatarFallback>{animal.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <Link href={`/animals/${animal._id}`}>
                  <h2 className="font-medium hover:underline cursor-pointer">{animal.name}</h2>
                </Link>
                <p>{animal.species} - {animal.breed}</p>
                <p>Arrived {animal.dateArrived}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge>{animal.status}</Badge>
              <Button asChild variant="ghost" size="icon">
                <Link href={`/animals/${animal._id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 