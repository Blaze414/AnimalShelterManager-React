export type AnimalStatus = "Available" | "Medical Check" | "Adopted" | "Quarantine";
export type MedicalRecordStatus = "Completed" | "Scheduled" | "In Progress";
export type ReportStatus = "Ready" | "Processing";
export type DashboardIcon = "paw" | "heart" | "dollar" | "users";

export interface MedicalHistoryEntry {
  type: string;
  date: string;
  notes: string;
}

export interface Animal {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  status: AnimalStatus;
  arrivedDate: string;
  behavior: string;
  description: string;
}

export interface AnimalDetails extends Animal {
  medicalHistory: MedicalHistoryEntry[];
}

export interface CreateAnimalPayload {
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  status: AnimalStatus | "";
  description: string;
  medicalHistory: string;
  behavior: string;
  arrivedDate?: string;
}

export interface MedicalRecord {
  animalId: number;
  animalName: string;
  type: string;
  doctor: string;
  date: string;
  status: MedicalRecordStatus;
  notes: string;
}

export interface CreateMedicalRecordPayload {
  animalId: number;
  type: string;
  doctor: string;
  date: string;
  status: MedicalRecordStatus | "";
  notes: string;
}

export interface Report {
  title: string;
  category: string;
  date: string;
  status: ReportStatus;
  format: string;
}

export interface Activity {
  title: string;
  description: string;
  time: string;
  initials: string;
}

export interface FinancialEntry {
  month: string;
  Donations: number;
  Adoptions: number;
  Expenses: number;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  icon: DashboardIcon;
}

export interface DashboardResponse {
  stats: DashboardStat[];
  overviewData: { month: string; animals: number }[];
  recentActivities: Activity[];
}
