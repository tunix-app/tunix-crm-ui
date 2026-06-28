import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { ApiError } from '@/lib/api';
import * as programApi from '@/lib/programApi';
import type { ProgramSummary, Program, CreateProgramDto } from '@/types/program';

export type ToastMessage = {
  id: number;
  message: string;
  type: 'error' | 'success';
};

export function usePrograms() {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientIdState] = useState<string | undefined>(undefined);
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
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

  const fetchPrograms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await programApi.getPrograms(selectedClientId);
      setPrograms(data);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          localStorage.removeItem('auth_token');
          clearUser();
          navigate('/', { replace: true });
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
      setError('Failed to load programs.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedClientId, addToast, clearUser, navigate]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const setSelectedClientId = useCallback((clientId: string | undefined) => {
    setPrograms([]);
    setSelectedClientIdState(clientId);
  }, []);

  const createProgram = useCallback(
    async (data: CreateProgramDto): Promise<Program | null> => {
      try {
        const created = await programApi.createProgram(data);
        await fetchPrograms();
        setActiveProgramId(created.id);
        addToast('Program created.', 'success');
        return created;
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            localStorage.removeItem('auth_token');
            clearUser();
            navigate('/', { replace: true });
            return null;
          }
          if (err.message === 'Network error or server unreachable') {
            addToast('Unable to reach the server. Check your connection.');
          } else {
            addToast('Something went wrong. Please try again.');
          }
        } else {
          addToast('Something went wrong. Please try again.');
        }
        return null;
      }
    },
    [fetchPrograms, addToast, clearUser, navigate],
  );

  const deleteProgram = useCallback(
    async (id: string): Promise<void> => {
      try {
        await programApi.deleteProgram(id);
        if (activeProgramId === id) {
          setActiveProgramId(null);
        }
        await fetchPrograms();
        addToast('Program deleted.', 'success');
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            localStorage.removeItem('auth_token');
            clearUser();
            navigate('/', { replace: true });
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
      }
    },
    [activeProgramId, fetchPrograms, addToast, clearUser, navigate],
  );

  return {
    programs,
    isLoading,
    error,
    selectedClientId,
    setSelectedClientId,
    activeProgramId,
    setActiveProgramId,
    createProgram,
    deleteProgram,
    refetch: fetchPrograms,
    toasts,
    dismissToast,
  };
}
