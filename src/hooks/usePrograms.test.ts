import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import React from 'react';
import { usePrograms } from './usePrograms';
import * as programApi from '@/lib/programApi';
import type { ProgramSummary } from '@/types/program';

vi.mock('@/lib/programApi');

const mockPrograms: ProgramSummary[] = [
  {
    id: 'prog-1',
    name: 'Phase 1',
    description: null,
    status: 'DRAFT',
    tags: [],
    client_id: 'client-1',
    client_name: 'Jane Doe',
    exercise_count: 3,
    created_at: '2026-05-24T10:00:00.000Z',
    updated_at: '2026-05-24T10:00:00.000Z',
  },
  {
    id: 'prog-2',
    name: 'Phase 2',
    description: null,
    status: 'READY',
    tags: [],
    client_id: 'client-2',
    client_name: 'Bob Smith',
    exercise_count: 5,
    created_at: '2026-05-24T10:00:00.000Z',
    updated_at: '2026-05-24T10:00:00.000Z',
  },
];

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(
    MemoryRouter,
    null,
    React.createElement(UserProvider, null, children),
  );
}

describe('usePrograms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state and loads programs', async () => {
    vi.mocked(programApi.getPrograms).mockResolvedValue(mockPrograms);
    const { result } = renderHook(() => usePrograms(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.programs).toEqual(mockPrograms);
    expect(result.current.error).toBeNull();
  });

  it('sets error on fetch failure', async () => {
    vi.mocked(programApi.getPrograms).mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => usePrograms(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).not.toBeNull();
    expect(result.current.programs).toEqual([]);
  });

  it('triggers a re-fetch with the new filter when setSelectedClientId is called', async () => {
    vi.mocked(programApi.getPrograms).mockResolvedValue(mockPrograms);
    const { result } = renderHook(() => usePrograms(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(programApi.getPrograms)).toHaveBeenCalledWith(undefined);

    vi.mocked(programApi.getPrograms).mockResolvedValue([mockPrograms[0]]);

    act(() => {
      result.current.setSelectedClientId('client-1');
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(programApi.getPrograms)).toHaveBeenLastCalledWith('client-1');
  });

  it('clears activeProgramId when the deleted program was active', async () => {
    vi.mocked(programApi.getPrograms).mockResolvedValue(mockPrograms);
    vi.mocked(programApi.deleteProgram).mockResolvedValue(undefined);

    const { result } = renderHook(() => usePrograms(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setActiveProgramId('prog-1');
    });

    expect(result.current.activeProgramId).toBe('prog-1');

    await act(async () => {
      await result.current.deleteProgram('prog-1');
    });

    expect(result.current.activeProgramId).toBeNull();
  });

  it('does not clear activeProgramId when a different program is deleted', async () => {
    vi.mocked(programApi.getPrograms).mockResolvedValue(mockPrograms);
    vi.mocked(programApi.deleteProgram).mockResolvedValue(undefined);

    const { result } = renderHook(() => usePrograms(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setActiveProgramId('prog-1');
    });

    await act(async () => {
      await result.current.deleteProgram('prog-2');
    });

    expect(result.current.activeProgramId).toBe('prog-1');
  });
});
