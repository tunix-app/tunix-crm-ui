import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import React from 'react';
import { useProgramDetail } from './useProgramDetail';
import * as programApi from '@/lib/programApi';
import { ApiError } from '@/lib/api';
import type { Program } from '@/types/program';

vi.mock('@/lib/programApi');

const mockProgram: Program = {
  id: 'prog-1',
  name: 'Phase 1 Strength',
  description: 'Foundation block',
  status: 'DRAFT',
  tags: [],
  client_id: 'client-1',
  client_name: 'Jane Doe',
  notes: null,
  exercises: [],
  created_at: '2026-05-24T10:00:00.000Z',
  updated_at: '2026-05-24T10:00:00.000Z',
};

const completeProgram: Program = {
  ...mockProgram,
  id: 'prog-complete',
  status: 'COMPLETE',
};

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(
    MemoryRouter,
    null,
    React.createElement(UserProvider, null, children),
  );
}

describe('useProgramDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts loading and loads program data', async () => {
    vi.mocked(programApi.getProgramById).mockResolvedValue(mockProgram);
    const { result } = renderHook(() => useProgramDetail('prog-1'), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.program).toEqual(mockProgram);
  });

  it('returns null program when no programId is provided', async () => {
    const { result } = renderHook(() => useProgramDetail(null), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.program).toBeNull();
    expect(vi.mocked(programApi.getProgramById)).not.toHaveBeenCalled();
  });

  it('resets edit mode to false when programId changes', async () => {
    vi.mocked(programApi.getProgramById).mockResolvedValue(mockProgram);
    const { result, rerender } = renderHook(
      ({ id }: { id: string | null }) => useProgramDetail(id),
      { wrapper, initialProps: { id: 'prog-1' } },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setIsEditMode(true);
    });

    expect(result.current.isEditMode).toBe(true);

    vi.mocked(programApi.getProgramById).mockResolvedValue({
      ...mockProgram,
      id: 'prog-2',
      name: 'Phase 2',
    });

    rerender({ id: 'prog-2' });

    expect(result.current.isEditMode).toBe(false);
  });

  it('ignores setIsEditMode(true) when program status is COMPLETE', async () => {
    vi.mocked(programApi.getProgramById).mockResolvedValue(completeProgram);
    const { result } = renderHook(() => useProgramDetail('prog-complete'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.program?.status).toBe('COMPLETE');

    act(() => {
      result.current.setIsEditMode(true);
    });

    expect(result.current.isEditMode).toBe(false);
  });

  it('triggers a browser download on successful exportProgram', async () => {
    vi.mocked(programApi.getProgramById).mockResolvedValue({
      ...mockProgram,
      status: 'READY',
    });

    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
    vi.mocked(programApi.exportProgramAsPdf).mockResolvedValue(mockBlob);

    const mockObjectUrl = 'blob:http://localhost/fake-url';
    URL.createObjectURL = vi.fn().mockReturnValue(mockObjectUrl);
    URL.revokeObjectURL = vi.fn();

    const { result } = renderHook(() => useProgramDetail('prog-1'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockClick = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick } as unknown as HTMLAnchorElement;
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') return mockAnchor;
      return originalCreateElement(tagName);
    });

    await act(async () => {
      await result.current.exportProgram();
    });

    expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockClick).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockObjectUrl);

    vi.restoreAllMocks();
  });

  it('shows toast on 403 during exportProgram', async () => {
    vi.mocked(programApi.getProgramById).mockResolvedValue({
      ...mockProgram,
      status: 'DRAFT',
    });
    vi.mocked(programApi.exportProgramAsPdf).mockRejectedValue(
      new ApiError(403, 'Forbidden'),
    );

    const { result } = renderHook(() => useProgramDetail('prog-1'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.exportProgram();
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe(
      'Only programs marked as Ready can be exported.',
    );
  });
});
