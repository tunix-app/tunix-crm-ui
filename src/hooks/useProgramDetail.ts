import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { ApiError } from '@/lib/api';
import * as programApi from '@/lib/programApi';
import type {
  Program,
  UpdateProgramDto,
  AddExerciseDto,
  UpdateProgramExerciseDto,
  ReorderExercisesDto,
} from '@/types/program';

export type ToastMessage = {
  id: number;
  message: string;
  type: 'error' | 'success';
};

export function useProgramDetail(programId: string | null) {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditModeState] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: 'error' | 'success' = 'error') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setIsEditMode = useCallback(
    (value: boolean) => {
      if (value && program?.status === 'COMPLETE') return;
      setIsEditModeState(value);
    },
    [program?.status],
  );

  const handleApiError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          localStorage.removeItem('auth_token');
          clearUser();
          navigate('/', { replace: true });
          return;
        }
        if (err.status === 403) {
          addToast("You don't have permission to do that.");
          return;
        }
        if (err.message === 'Network error or server unreachable') {
          addToast('Unable to reach the server. Check your connection.');
        } else {
          addToast('Something went wrong. Please try again.');
        }
      } else {
        addToast('Something went wrong. Please try again.');
      }
    },
    [addToast, clearUser, navigate],
  );

  const fetchProgram = useCallback(async () => {
    if (!programId) return;
    setIsLoading(true);
    try {
      const data = await programApi.getProgramById(programId);
      setProgram(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [programId, handleApiError]);

  useEffect(() => {
    setIsEditModeState(false);
    setProgram(null);
    fetchProgram();
    // fetchProgram is stable when programId is stable; only run on programId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const updateProgram = useCallback(
    async (data: UpdateProgramDto): Promise<void> => {
      if (!programId) return;
      try {
        const updated = await programApi.updateProgram(programId, data);
        setProgram(updated);
        addToast('Program updated.', 'success');
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [programId, handleApiError, addToast],
  );

  const addExercise = useCallback(
    async (data: AddExerciseDto): Promise<void> => {
      if (!programId) return;
      try {
        await programApi.addExerciseToProgram(programId, data);
        await fetchProgram();
        addToast('Exercise added.', 'success');
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [programId, fetchProgram, handleApiError, addToast],
  );

  const updateExercise = useCallback(
    async (programExerciseId: string, data: UpdateProgramExerciseDto): Promise<void> => {
      if (!programId) return;
      try {
        const updated = await programApi.updateProgramExercise(
          programId,
          programExerciseId,
          data,
        );
        setProgram((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            exercises: prev.exercises.map((e) => (e.id === programExerciseId ? updated : e)),
          };
        });
        addToast('Exercise updated.', 'success');
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [programId, handleApiError, addToast],
  );

  const removeExercise = useCallback(
    async (programExerciseId: string): Promise<void> => {
      if (!programId) return;
      try {
        await programApi.removeProgramExercise(programId, programExerciseId);
        await fetchProgram();
        addToast('Exercise removed.', 'success');
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [programId, fetchProgram, handleApiError, addToast],
  );

  const reorderExercises = useCallback(
    async (data: ReorderExercisesDto): Promise<void> => {
      if (!programId) return;
      try {
        const updated = await programApi.reorderProgramExercises(programId, data);
        setProgram(updated);
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [programId, handleApiError],
  );

  const exportProgram = useCallback(async (): Promise<void> => {
    if (!programId || !program) return;
    try {
      const blob = await programApi.exportProgramAsPdf(programId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${program.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        addToast('Only programs marked as Ready can be exported.');
      } else {
        handleApiError(err);
      }
    }
  }, [programId, program, addToast, handleApiError]);

  return {
    program,
    isLoading,
    isEditMode,
    setIsEditMode,
    updateProgram,
    addExercise,
    updateExercise,
    removeExercise,
    reorderExercises,
    exportProgram,
    toasts,
    dismissToast,
  };
}
