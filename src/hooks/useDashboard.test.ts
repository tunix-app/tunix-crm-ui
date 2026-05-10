import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDashboard } from './useDashboard';
import * as dashboardApi from '@/lib/dashboardApi';
import type { CoachDashboard } from '@/types/dashboard';

vi.mock('@/lib/dashboardApi');

const mockDashboardData: CoachDashboard = {
  total_sessions_today: 3,
  total_active_clients: 10,
  sessions_today: [],
  unscheduled_clients: [],
};

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state', () => {
    vi.mocked(dashboardApi.getDashboard).mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboard());
    expect(result.current.isLoading).toBe(true);
  });

  it('sets dashboard data on successful fetch', async () => {
    vi.mocked(dashboardApi.getDashboard).mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.dashboard).toEqual(mockDashboardData);
    expect(result.current.error).toBeNull();
  });

  it('stops loading and leaves dashboard null on fetch failure', async () => {
    vi.mocked(dashboardApi.getDashboard).mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.dashboard).toBeNull();
  });

  it('re-fetches when selectedDate changes', async () => {
    vi.mocked(dashboardApi.getDashboard).mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(dashboardApi.getDashboard)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(dashboardApi.getDashboard)).toHaveBeenCalledWith(undefined);

    await act(async () => {
      result.current.setSelectedDate('2026-05-10');
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(dashboardApi.getDashboard)).toHaveBeenCalledTimes(2);
    expect(vi.mocked(dashboardApi.getDashboard)).toHaveBeenLastCalledWith('2026-05-10');
  });

  it('clears dashboard data when setSelectedDate is called', async () => {
    vi.mocked(dashboardApi.getDashboard).mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.dashboard).toEqual(mockDashboardData);

    act(() => {
      result.current.setSelectedDate('2026-05-10');
    });

    expect(result.current.dashboard).toBeNull();
  });
});
