import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ClientWaiver from './ClientWaiver';
import { waiverApi } from '@/lib/waiverApi';

vi.mock('@/lib/waiverApi', () => ({
  waiverApi: {
    getWaivers: vi.fn(),
    getSignedUrl: vi.fn(),
    uploadWaiver: vi.fn(),
    deleteWaiver: vi.fn(),
  },
}));

const api = vi.mocked(waiverApi);

describe('ClientWaiver view', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getWaivers.mockResolvedValue([{ id: 'w1', clientId: 'c1', fileName: 'waiver.pdf', createdAt: null }]);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ blob: () => Promise.resolve(new Blob()) }));
    URL.createObjectURL = vi.fn(() => 'blob:waiver');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('opens the tab during the tap, so Safari does not block it, then shows the file', async () => {
    const tab = { opener: window, location: { href: '' }, close: vi.fn() };
    const open = vi.spyOn(window, 'open').mockReturnValue(tab as unknown as Window);
    render(<ClientWaiver clientId="c1" />);

    fireEvent.click(await screen.findByTitle('View waiver'));

    expect(open).toHaveBeenCalledTimes(1);
    expect(api.getSignedUrl).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(tab.location.href).toBe('blob:waiver'));
    expect(tab.opener).toBeNull();
  });

  it('closes the tab and tells the coach when the waiver cannot be loaded', async () => {
    const tab = { opener: window, location: { href: '' }, close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue(tab as unknown as Window);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    api.getSignedUrl.mockRejectedValue(new Error('500'));
    render(<ClientWaiver clientId="c1" />);

    fireEvent.click(await screen.findByTitle('View waiver'));

    await waitFor(() => expect(tab.close).toHaveBeenCalled());
    expect(alert).toHaveBeenCalledWith('Failed to open waiver. Please try again.');
  });
});
