import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSidebarLayout } from './useSidebarLayout';

function setWidth(width: number) {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
}

describe('useSidebarLayout', () => {
  it.each([
    [768, 'drawer'],
    [1023, 'drawer'],
    [1024, 'rail'],
    [1279, 'rail'],
    [1280, 'expanded'],
    [1366, 'expanded'],
  ])('at %ipx returns %s', (width, layout) => {
    window.innerWidth = width;
    const { result } = renderHook(() => useSidebarLayout());
    expect(result.current).toBe(layout);
  });

  it('updates when the width crosses a breakpoint', () => {
    window.innerWidth = 820;
    const { result } = renderHook(() => useSidebarLayout());
    expect(result.current).toBe('drawer');
    act(() => setWidth(1180));
    expect(result.current).toBe('rail');
  });
});
