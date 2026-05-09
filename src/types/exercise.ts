export type Exercise = {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  tags: string[];
  exercise_demo: string | null;
};

export type CreateExerciseDto = {
  name: string;
  description?: string;
  tags?: string[];
  exercise_demo?: string | null;
};

export type UpdateExerciseDto = Partial<CreateExerciseDto>;

export type ExerciseFormState = {
  name: string;
  description: string;
  tags: string[];
  exercise_demo: string;
};
