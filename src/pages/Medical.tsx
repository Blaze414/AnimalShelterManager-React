import { useMemo, useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { useAnimals, useCreateMedicalRecord, useMedicalRecords } from "@/hooks/use-shelter-api";
import { useToast } from "@/hooks/use-toast";
import type { CreateMedicalRecordPayload } from "@/types/shelter";

const Medical = () => {
  const { toast } = useToast();
  const { data: animals } = useAnimals();
  const { data: medicalRecords, isLoading, isError, error } = useMedicalRecords();
  const createMedicalRecord = useCreateMedicalRecord();
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<CreateMedicalRecordPayload>({
    animalId: 0,
    type: "",
    doctor: "",
    date: new Date().toISOString().slice(0, 10),
    status: "Scheduled",
    notes: "",
  });

  const sortedAnimals = useMemo(
    () => [...(animals ?? [])].sort((left, right) => left.name.localeCompare(right.name)),
    [animals],
  );

  const update = <K extends keyof CreateMedicalRecordPayload>(field: K, value: CreateMedicalRecordPayload[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      animalId: 0,
      type: "",
      doctor: "",
      date: new Date().toISOString().slice(0, 10),
      status: "Scheduled",
      notes: "",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const record = await createMedicalRecord.mutateAsync(form);
      toast({
        title: "Medical record added",
        description: `${record.type} was saved for ${record.animalName}.`,
      });
      resetForm();
      setIsCreating(false);
    } catch (submitError) {
      toast({
        title: "Could not add medical record",
        description: submitError instanceof Error ? submitError.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
        <button
          onClick={() => setIsCreating((previous) => !previous)}
          className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-md text-sm hover:bg-secondary transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Close" : "New Record"}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Add Medical Record</h2>
            <p className="text-sm text-muted-foreground">Create a medical record and attach it to a specific animal.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Animal</label>
              <select
                value={form.animalId}
                onChange={(event) => update("animalId", Number(event.target.value))}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value={0}>Select animal</option>
                {sortedAnimals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name} · {animal.species}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Record Type</label>
              <input
                value={form.type}
                onChange={(event) => update("type", event.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Vaccination"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Doctor</label>
              <input
                value={form.doctor}
                onChange={(event) => update("doctor", event.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Dr. Smith"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(event) => update("date", event.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Status</label>
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value as CreateMedicalRecordPayload["status"])}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              rows={3}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              placeholder="Add exam notes, treatment details, or follow-up instructions..."
            />
          </div>

          <button
            type="submit"
            disabled={createMedicalRecord.isPending}
            className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMedicalRecord.isPending ? "Saving..." : "Save Medical Record"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading medical records...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load medical records."}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {medicalRecords?.map((record) => (
            <div key={`${record.animalName}-${record.type}-${record.date}`} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {record.animalName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{record.animalName}</p>
                  <p className="text-xs text-muted-foreground">{record.type}</p>
                  <p className="text-xs text-muted-foreground">{record.doctor}</p>
                  {record.notes ? <p className="text-xs text-muted-foreground mt-1">{record.notes}</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {record.date}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    record.status === "Completed"
                      ? "border-border text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Medical;
