import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, User, Heart, Share2, Pencil, Clock } from "lucide-react";
import { useAnimal, useUpdateAnimal } from "@/hooks/use-shelter-api";
import { useToast } from "@/hooks/use-toast";
import type { AnimalStatus, CreateAnimalPayload } from "@/types/shelter";

function formFromAnimal(animal: NonNullable<Awaited<ReturnType<typeof useAnimal>>["data"]>): CreateAnimalPayload {
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

const AnimalDetails = () => {
  const { id } = useParams();
  const animalId = Number(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: animal, isLoading, isError, error } = useAnimal(animalId);
  const updateAnimal = useUpdateAnimal();
  const [activeTab, setActiveTab] = useState<"details" | "medical" | "notes">("medical");
  const [status, setStatus] = useState<AnimalStatus>("Available");

  useEffect(() => {
    if (animal) {
      setStatus(animal.status);
    }
  }, [animal]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading animal details...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
        {error instanceof Error ? error.message : "Failed to load animal."}
      </div>
    );
  }

  if (!animal) {
    return <div className="text-foreground">Animal not found.</div>;
  }

  const tabs = ["Details", "Medical History", "Notes"] as const;
  const tabKeys = ["details", "medical", "notes"] as const;

  const handleStatusSave = async () => {
    try {
      await updateAnimal.mutateAsync({
        id: animal.id,
        payload: {
          ...formFromAnimal(animal),
          status,
        },
      });
      toast({
        title: "Status updated",
        description: `${animal.name} is now marked as ${status}.`,
      });
    } catch (mutationError) {
      toast({
        title: "Could not update status",
        description: mutationError instanceof Error ? mutationError.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Animal Details</h1>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between min-h-[320px]">
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <img src={`https://placedog.net/500/300?id=${animal.id}`} alt={animal.name} className="rounded-md max-h-60 object-cover" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <button className="border border-border rounded-md p-2 text-muted-foreground hover:text-foreground">
                <Heart className="h-4 w-4" />
              </button>
              <button className="border border-border rounded-md p-2 text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => navigate(`/animals/${animal.id}/edit`)}
              className="flex items-center gap-2 border border-border rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
            >
              <Pencil className="h-3 w-3" />
              Edit Details
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{animal.name}</h2>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as AnimalStatus)}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="Available">Available</option>
                <option value="Medical Check">Medical Check</option>
                <option value="Adopted">Adopted</option>
                <option value="Quarantine">Quarantine</option>
              </select>
              <button
                onClick={handleStatusSave}
                disabled={updateAnimal.isPending || status === animal.status}
                className="border border-border rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateAnimal.isPending ? "Saving..." : "Save Status"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-xs text-muted-foreground">Species</p>
              <p className="text-sm font-medium text-foreground">{animal.species}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Breed</p>
              <p className="text-sm font-medium text-foreground">{animal.breed}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="text-sm font-medium text-foreground">{animal.age}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="text-sm font-medium text-foreground">{animal.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="text-sm font-medium text-foreground">{animal.weight}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Behavior</p>
              <p className="text-sm font-medium text-foreground">{animal.behavior}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Arrived {animal.arrivedDate}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" /> ID: {animal.id}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-1 bg-secondary rounded-md p-1 w-fit">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tabKeys[index])}
              className={`px-4 py-1.5 rounded text-sm transition-colors ${
                activeTab === tabKeys[index]
                  ? "bg-card text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "details" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">About {animal.name}</h3>
          <p className="text-sm text-muted-foreground">{animal.description}</p>
        </div>
      )}

      {activeTab === "medical" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Medical History</h3>
          <div className="space-y-4">
            {animal.medicalHistory.map((record) => (
              <div key={`${record.type}-${record.date}`} className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{record.type}</p>
                  <p className="text-xs text-muted-foreground">{record.date}</p>
                  <p className="text-sm text-muted-foreground">{record.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">Notes are now sourced from the backend medical timeline.</p>
        </div>
      )}
    </div>
  );
};

export default AnimalDetails;
