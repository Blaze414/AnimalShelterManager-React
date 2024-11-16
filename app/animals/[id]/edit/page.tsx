import { EditAnimalForm } from "@/components/animals/edit-animal-form"

export default async function EditAnimalPage({ params }: { params: { id: string } }) {
  const id = await Promise.resolve(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Animal Details</h1>
      </div>
      <EditAnimalForm id={id} />
    </div>
  )
} 