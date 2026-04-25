import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAnimal, useCreateAnimal, useUpdateAnimal } from "@/hooks/use-shelter-api";
import type { CreateAnimalPayload } from "@/types/shelter";

const emptyForm: CreateAnimalPayload = {
  name: "",
  species: "",
  breed: "",
  age: "",
  gender: "",
  weight: "",
  status: "Available",
  description: "",
  medicalHistory: "",
  behavior: "",
};

function formFromAnimal(animal: Awaited<ReturnType<typeof useAnimal>>["data"]): CreateAnimalPayload {
  if (!animal) {
    return emptyForm;
  }

  const intakeNote = animal.medicalHistory.find((entry) => entry.type === "Intake Note")?.notes ?? "";

  return {
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    age: animal.age,
    gender: animal.gender,
    weight: animal.weight,
    status: animal.status,
    description: animal.description,
    medicalHistory: intakeNote,
    behavior: animal.behavior,
    arrivedDate: animal.arrivedDate,
  };
}

const AddAnimal = () => {
  const { id } = useParams();
  const animalId = Number(id);
  const isEditing = Number.isFinite(animalId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const createAnimal = useCreateAnimal();
  const updateAnimal = useUpdateAnimal();
  const { data: animal, isLoading, isError, error } = useAnimal(animalId);
  const [form, setForm] = useState<CreateAnimalPayload>(emptyForm);

  useEffect(() => {
    if (isEditing && animal) {
      setForm(formFromAnimal(animal));
    }
  }, [animal, isEditing]);

  const update = (field: keyof CreateAnimalPayload, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.status) {
      toast({
        title: "Choose a status",
        description: "Please select an animal status before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      const savedAnimal = isEditing
        ? await updateAnimal.mutateAsync({ id: animalId, payload: form })
        : await createAnimal.mutateAsync(form);
      toast({
        title: isEditing ? "Animal updated" : "Animal added",
        description: `${savedAnimal.name} has been saved to the backend.`,
      });
      navigate(`/animals/${savedAnimal.id}`);
    } catch (error) {
      toast({
        title: isEditing ? "Could not update animal" : "Could not add animal",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-sm text-muted-foreground">Loading animal for editing...</div>;
  }

  if (isEditing && isError) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
        {error instanceof Error ? error.message : "Failed to load animal."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Edit Animal" : "Add New Animal"}</h1>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{isEditing ? "Update Animal Details" : "Add New Animal"}</h2>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update the animal record and save the changes back to the shelter database."
              : "Enter the details of the new animal to add them to the shelter."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Max" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Species</label>
            <select value={form.species} onChange={(e) => update("species", e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Breed</label>
            <input value={form.breed} onChange={(e) => update("breed", e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="German Shepherd" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Age</label>
            <input value={form.age} onChange={(e) => update("age", e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="2 years" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Gender</label>
            <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Weight</label>
            <input value={form.weight} onChange={(e) => update("weight", e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="30 kg" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Status</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="Available">Available</option>
            <option value="Medical Check">Medical Check</option>
            <option value="Adopted">Adopted</option>
            <option value="Quarantine">Quarantine</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y" placeholder="Enter a detailed description of the animal..." />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Intake Notes</label>
          <textarea value={form.medicalHistory} onChange={(e) => update("medicalHistory", e.target.value)} rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y" placeholder="Enter any relevant intake or handoff notes..." />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Behavior</label>
          <textarea value={form.behavior} onChange={(e) => update("behavior", e.target.value)} rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y" placeholder="Describe the animal's behavior and temperament..." />
        </div>

        <button
          type="submit"
          disabled={createAnimal.isPending || updateAnimal.isPending}
          className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createAnimal.isPending || updateAnimal.isPending
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Add Animal"}
        </button>
      </form>
    </div>
  );
};

export default AddAnimal;
