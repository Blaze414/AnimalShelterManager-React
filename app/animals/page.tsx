'use client'

import { Button } from "@/components/ui/button"
import { AnimalsList } from "@/components/animals/animals-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AnimalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Animals</h1>
        <Button asChild>
          <Link href="/animals/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Animal
          </Link>
        </Button>
      </div>
      <AnimalsList />
    </div>
  )
}