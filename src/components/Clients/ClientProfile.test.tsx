import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ClientProfile from './ClientProfile';
import { clientApi } from '@/lib/clientApi';

vi.mock('@/lib/clientApi', () => ({
  clientApi: { getClientById: vi.fn(), updateClient: vi.fn(), decommissionClient: vi.fn() },
}));
vi.mock('@/lib/sessionApi', () => ({
  sessionApi: { getSessionsByClientId: vi.fn().mockResolvedValue([]) },
}));
vi.mock('@/lib/waiverApi', () => ({
  waiverApi: { getWaivers: vi.fn().mockResolvedValue([]) },
}));
vi.mock('@/lib/noteApi', () => ({
  noteApi: { getNotesByClientId: vi.fn().mockResolvedValue([]) },
}));
vi.mock('@/components/Calendar/scheduling/newSessionDialog', () => ({
  NewSession: ({ trigger }: { trigger: React.ReactNode }) => trigger,
}));

const api = vi.mocked(clientApi);
const client = {
  id: 'c1',
  client_id: 'client-1',
  client_name: 'Jane Doe',
  client_email: 'jane@example.com',
  phone: '5551234567',
  joinDate: '',
  isActive: true,
  last_session: '',
  next_session: null,
  goals: ['Build strength', 'Lose weight'],
  notes: '',
  programs: [],
  metrics: { attendance: 0 },
  profileImage: '',
};

async function renderProfile() {
  render(
    <MemoryRouter>
      <ClientProfile client={client} />
    </MemoryRouter>,
  );
  fireEvent.click(await screen.findByRole('button', { name: 'Remove goal: Build strength' }));
}

describe('ClientProfile goal delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getClientById.mockResolvedValue(client);
    api.updateClient.mockResolvedValue(client);
  });

  it('removes the goal after the coach confirms', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await renderProfile();

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(api.updateClient).toHaveBeenCalledWith('c1', { goals: ['Lose weight'] });
    await waitFor(() => expect(screen.queryByText('Build strength')).toBeNull());
    expect(screen.getByText('Lose weight')).toBeInTheDocument();
  });

  it('keeps the goal when the coach cancels', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await renderProfile();

    expect(api.updateClient).not.toHaveBeenCalled();
    expect(screen.getByText('Build strength')).toBeInTheDocument();
  });
});
