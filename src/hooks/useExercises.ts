import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { ApiError } from "@/lib/api";
import * as exercisesApi from "@/lib/exercises-api";
import type { Exercise, CreateExerciseDto, UpdateExerciseDto } from "@/types/exercise";

export type ToastMessage = {
  id: number;
  message: string;
  type: "error" | "success";
};

interface UseExercisesReturn {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  search: string;
  setSearch: (search: string) => void;
  createExercise: (data: CreateExerciseDto) => Promise<Exercise>;
  updateExercise: (id: string, data: UpdateExerciseDto) => Promise<Exercise>;
  deleteExercise: (id: string) => Promise<void>;
  toasts: ToastMessage[];
  addToast: (message: string, type?: "error" | "success") => void;
  dismissToast: (id: number) => void;
}

export function useExercises(): UseExercisesReturn {
  const { userId } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const addToast = useCallback((message: string, type: "error" | "success" = "error") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchExercises = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await exercisesApi.getExercises(userId, debouncedSearch || undefined);
      setExercises(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        window.location.href = "/";
        return;
      }
      setError("Failed to load exercises.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, debouncedSearch]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const createExercise = useCallback(
    async (data: CreateExerciseDto): Promise<Exercise> => {
      if (!userId) throw new Error("No user");
      const result = await exercisesApi.createExercise(userId, data);
      await fetchExercises();
      return result;
    },
    [userId, fetchExercises]
  );

  const updateExercise = useCallback(
    async (id: string, data: UpdateExerciseDto): Promise<Exercise> => {
      const result = await exercisesApi.updateExercise(id, data);
      await fetchExercises();
      return result;
    },
    [fetchExercises]
  );

  const deleteExercise = useCallback(
    async (id: string): Promise<void> => {
      await exercisesApi.deleteExercise(id);
      await fetchExercises();
    },
    [fetchExercises]
  );

  return {
    exercises,
    isLoading,
    error,
    search,
    setSearch,
    createExercise,
    updateExercise,
    deleteExercise,
    toasts,
    addToast,
    dismissToast,
  };
}
