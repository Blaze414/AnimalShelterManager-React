import type {
  Animal,
  AnimalDetails,
  CreateAnimalPayload,
  CreateMedicalRecordPayload,
  DashboardResponse,
  FinancialEntry,
  MedicalRecord,
  Report,
} from "@/types/shelter";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...init,
  });

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const payload = (await response.json()) as { error?: string };
      message = payload.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export const shelterApi = {
  getDashboard: () => request<DashboardResponse>("/dashboard"),
  getAnimals: () => request<Animal[]>("/animals"),
  getAnimal: (id: number) => request<AnimalDetails>(`/animals/${id}`),
  createAnimal: (payload: CreateAnimalPayload) =>
    request<AnimalDetails>("/animals", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAnimal: (id: number, payload: CreateAnimalPayload) =>
    request<AnimalDetails>(`/animals/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  getMedicalRecords: () => request<MedicalRecord[]>("/medical-records"),
  createMedicalRecord: (payload: CreateMedicalRecordPayload) =>
    request<MedicalRecord>("/medical-records", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getFinancialEntries: () => request<FinancialEntry[]>("/financial"),
  getReports: () => request<Report[]>("/reports"),
};

export { ApiError };
