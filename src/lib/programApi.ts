import { apiRequest, ApiError } from './api';
import type {
  Program,
  ProgramSummary,
  ProgramExercise,
  CreateProgramDto,
  UpdateProgramDto,
  AddExerciseDto,
  UpdateProgramExerciseDto,
  ReorderExercisesDto,
} from '@/types/program';

export async function getPrograms(clientId?: string): Promise<ProgramSummary[]> {
  const params = clientId ? `?client_id=${encodeURIComponent(clientId)}` : '';
  return apiRequest<ProgramSummary[]>(`/programs${params}`);
}

export async function createProgram(data: CreateProgramDto): Promise<Program> {
  return apiRequest<Program>('/programs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProgramById(id: string): Promise<Program> {
  return apiRequest<Program>(`/programs/${id}`);
}

export async function updateProgram(id: string, data: UpdateProgramDto): Promise<Program> {
  return apiRequest<Program>(`/programs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteProgram(id: string): Promise<void> {
  return apiRequest<void>(`/programs/${id}`, { method: 'DELETE' });
}

export async function addExerciseToProgram(
  programId: string,
  data: AddExerciseDto,
): Promise<ProgramExercise> {
  return apiRequest<ProgramExercise>(`/programs/${programId}/exercises`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProgramExercise(
  programId: string,
  programExerciseId: string,
  data: UpdateProgramExerciseDto,
): Promise<ProgramExercise> {
  return apiRequest<ProgramExercise>(
    `/programs/${programId}/exercises/${programExerciseId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export async function removeProgramExercise(
  programId: string,
  programExerciseId: string,
): Promise<void> {
  return apiRequest<void>(
    `/programs/${programId}/exercises/${programExerciseId}`,
    { method: 'DELETE' },
  );
}

export async function reorderProgramExercises(
  programId: string,
  data: ReorderExercisesDto,
): Promise<Program> {
  return apiRequest<Program>(`/programs/${programId}/exercises/reorder`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function exportProgramAsPdf(programId: string): Promise<Blob> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`/api/programs/${programId}/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
  }
  return response.blob();
}
