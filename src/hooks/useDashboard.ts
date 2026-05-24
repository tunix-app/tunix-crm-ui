import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/lib/api';
import { getDashboard } from '@/lib/dashboardApi';
import { useUser } from '@/context/UserContext';
import type { CoachDashboard, DashboardSession } from '@/types/dashboard';

export type ToastMessage = {
  id: number;
  message: string;
  type: 'error' | 'success';
};

function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getNext7Days(): string[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return toLocalDateString(d);
  });
}

export function useDashboard() {
  const navigate = useNavigate();
  const { clearUser } = useUser();
  const [dashboard, setDashboard] = useState<CoachDashboard | null>(null);
  const [weekSessions, setWeekSessions] = useState<DashboardSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const weekDates = getNext7Days();
      const todayStr = toLocalDateString(new Date());
      const results = await Promise.all(weekDates.map((date) => getDashboard(date)));
      const todayIndex = weekDates.indexOf(todayStr);
      setDashboard(results[todayIndex !== -1 ? todayIndex : 0]);
      const now = new Date();
      setWeekSessions(
        results
          .flatMap((r) => r.sessions_today)
          .filter((s) => new Date(s.end_time) > now)
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()),
      );
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          localStorage.removeItem('auth_token');
          clearUser();
          navigate('/', { replace: true });
          return;
        }
        addToast(
          err.message === 'Network error or server unreachable'
            ? 'Unable to reach the server. Check your connection.'
            : 'Something went wrong. Please try again.',
        );
      } else {
        addToast('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [addToast, clearUser, navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    weekSessions,
    isLoading,
    error,
    toasts,
    dismissToast,
    refetch: fetchDashboard,
  };
}
