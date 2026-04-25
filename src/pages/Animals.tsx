import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Search } from "lucide-react";
import { useAnimals } from "@/hooks/use-shelter-api";

const Animals = () => {
  const { data: animals, isLoading, isError, error } = useAnimals();
  const [search, setSearch] = useState("");

  const filtered = animals?.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.species.toLowerCase().includes(search.toLowerCase()) ||
    a.breed.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Animals</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search animals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary text-foreground text-sm pl-9 pr-4 py-1.5 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-ring w-48"
            />
          </div>
          <Link
            to="/animals/add"
            className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-md text-sm hover:bg-secondary transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Animal
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading animals...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load animals."}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No animals found.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {filtered?.map((animal) => (
            <div key={animal.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {animal.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{animal.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {animal.species} · {animal.breed}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Arrived {animal.arrivedDate}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    animal.status === "Available"
                      ? "border-border text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {animal.status}
                </span>
                <Link to={`/animals/${animal.id}`} className="text-muted-foreground hover:text-foreground">
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Animals;
