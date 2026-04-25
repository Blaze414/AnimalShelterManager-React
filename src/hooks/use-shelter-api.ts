import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shelterApi } from "@/lib/api";
import type { CreateAnimalPayload, CreateMedicalRecordPayload } from "@/types/shelter";

export const shelterKeys = {
  dashboard: ["dashboard"] as const,
  animals: ["animals"] as const,
  animal: (id: number) => ["animals", id] as const,
  medicalRecords: ["medical-records"] as const,
  financial: ["financial"] as const,
  reports: ["reports"] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: shelterKeys.dashboard,
    queryFn: shelterApi.getDashboard,
  });
}

export function useAnimals() {
  return useQuery({
    queryKey: shelterKeys.animals,
    queryFn: shelterApi.getAnimals,
  });
}

export function useAnimal(id: number) {
  return useQuery({
    queryKey: shelterKeys.animal(id),
    queryFn: () => shelterApi.getAnimal(id),
    enabled: Number.isFinite(id),
  });
}

export function useMedicalRecords() {
  return useQuery({
    queryKey: shelterKeys.medicalRecords,
    queryFn: shelterApi.getMedicalRecords,
  });
}

export function useFinancialEntries() {
  return useQuery({
    queryKey: shelterKeys.financial,
    queryFn: shelterApi.getFinancialEntries,
  });
}

export function useReports() {
  return useQuery({
    queryKey: shelterKeys.reports,
    queryFn: shelterApi.getReports,
  });
}

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAnimalPayload) => shelterApi.createAnimal(payload),
    onSuccess: (animal) => {
      queryClient.invalidateQueries({ queryKey: shelterKeys.animals });
      queryClient.invalidateQueries({ queryKey: shelterKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: shelterKeys.medicalRecords });
      queryClient.setQueryData(shelterKeys.animal(animal.id), animal);
    },
  });
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateAnimalPayload }) =>
      shelterApi.updateAnimal(id, payload),
    onSuccess: (animal) => {
      queryClient.invalidateQueries({ queryKey: shelterKeys.animals });
      queryClient.invalidateQueries({ queryKey: shelterKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: shelterKeys.medicalRecords });
      queryClient.setQueryData(shelterKeys.animal(animal.id), animal);
    },
  });
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMedicalRecordPayload) => shelterApi.createMedicalRecord(payload),
    onSuccess: (record) => {
      queryClient.invalidateQueries({ queryKey: shelterKeys.medicalRecords });
      queryClient.invalidateQueries({ queryKey: shelterKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: shelterKeys.animal(record.animalId) });
    },
  });
}
