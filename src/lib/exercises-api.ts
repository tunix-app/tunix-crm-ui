import { apiRequest } from "./api";
import type { Exercise, CreateExerciseDto, UpdateExerciseDto } from "@/types/exercise";

export async function getExercises(trainerId: string, search?: string): Promise<Exercise[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<Exercise[]>(`/exercise/trainer/${trainerId}${params}`);
}

export async function getExerciseById(id: string): Promise<Exercise> {
  return apiRequest<Exercise>(`/exercise/${id}`);
}

export async function createExercise(trainerId: string, data: CreateExerciseDto): Promise<Exercise> {
  return apiRequest<Exercise>(`/exercise/trainer/${trainerId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExercise(id: string, data: UpdateExerciseDto): Promise<Exercise> {
  return apiRequest<Exercise>(`/exercise/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteExercise(id: string): Promise<void> {
  return apiRequest<void>(`/exercise/${id}`, { method: "DELETE" });
}
