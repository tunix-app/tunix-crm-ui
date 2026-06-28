import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import React from 'react';
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

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(
    MemoryRouter,
    null,
    React.createElement(UserProvider, null, children),
  );
}

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state', () => {
    vi.mocked(dashboardApi.getDashboard).mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('sets dashboard data on successful fetch', async () => {
    vi.mocked(dashboardApi.getDashboard).mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboard(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.dashboard).toEqual(mockDashboardData);
    expect(result.current.error).toBeNull();
  });

  it('stops loading and leaves dashboard null on fetch failure', async () => {
    vi.mocked(dashboardApi.getDashboard).mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => useDashboard(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.dashboard).toBeNull();
  });

  it('calls getDashboard for multiple days on initial fetch', async () => {
    vi.mocked(dashboardApi.getDashboard).mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboard(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(vi.mocked(dashboardApi.getDashboard).mock.calls.length).toBeGreaterThan(1);
  });

  it('re-fetches when refetch is called', async () => {
    vi.mocked(dashboardApi.getDashboard).mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboard(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const callCountAfterMount = vi.mocked(dashboardApi.getDashboard).mock.calls.length;

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(vi.mocked(dashboardApi.getDashboard).mock.calls.length).toBeGreaterThan(
      callCountAfterMount,
    );
  });
});
