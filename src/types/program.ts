export type ProgramStatus = 'DRAFT' | 'READY' | 'IN_PROGRESS' | 'COMPLETE';

export type ProgramExercise = {
  id: string;
  exercise_id: string;
  exercise_name: string;
  exercise_demo: string | null;
  tags: string[];
  order_index: number;
  sets: number | null;
  reps: string | null;
  duration_seconds: number | null;
  notes: string | null;
};

export type ProgramSummary = {
  id: string;
  name: string;
  description: string | null;
  status: ProgramStatus;
  tags: string[];
  client_id: string;
  client_name: string;
  exercise_count: number;
  created_at: string;
  updated_at: string;
};

export type Program = {
  id: string;
  name: string;
  description: string | null;
  status: ProgramStatus;
  tags: string[];
  client_id: string;
  client_name: string;
  notes: string | null;
  exercises: ProgramExercise[];
  created_at: string;
  updated_at: string;
};

export type ReorderExercisesDto = {
  exercises: { id: string; order_index: number }[];
};

export type CreateProgramDto = {
  client_id: string;
  name: string;
  description?: string;
  tags?: string[];
};

export type UpdateProgramDto = {
  name?: string;
  description?: string;
  status?: ProgramStatus;
  tags?: string[];
  notes?: string;
};

export type AddExerciseDto = {
  exercise_id: string;
  sets?: number;
  reps?: string;
  duration_seconds?: number;
  notes?: string;
};

export type UpdateProgramExerciseDto = {
  sets?: number;
  reps?: string;
  duration_seconds?: number;
  notes?: string;
};
