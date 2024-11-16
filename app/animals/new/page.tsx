import { AnimalForm } from "@/components/animals/animal-form"

export default function NewAnimalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Animal</h1>
      </div>
      <AnimalForm />
    </div>
  )
} 