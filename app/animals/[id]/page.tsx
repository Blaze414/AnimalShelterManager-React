import { AnimalDetails } from "@/components/animal-details"

export default async function AnimalDetailsPage({ params }: { params: { id: string } }) {
  const id = await Promise.resolve(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Animal Details</h1>
      </div>
      <AnimalDetails id={id} />
    </div>
  )
} 