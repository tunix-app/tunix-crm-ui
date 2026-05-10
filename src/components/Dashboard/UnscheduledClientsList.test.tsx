import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UnscheduledClientsList } from './UnscheduledClientsList';
import type { UnscheduledClient } from '@/types/dashboard';

const mockClients: UnscheduledClient[] = [
  {
    id: '1',
    client_id: 'c1',
    client_name: 'Charlie Brown',
    client_email: 'charlie@example.com',
    last_session: '2026-04-20T10:00:00.000Z',
  },
  {
    id: '2',
    client_id: 'c2',
    client_name: 'Diana Prince',
    client_email: 'diana@example.com',
    last_session: null,
  },
];

describe('UnscheduledClientsList', () => {
  it('renders all columns for each client', () => {
    render(<UnscheduledClientsList clients={mockClients} isLoading={false} />);

    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    expect(screen.getByText('charlie@example.com')).toBeInTheDocument();
    expect(screen.getByText('Diana Prince')).toBeInTheDocument();
    expect(screen.getByText('diana@example.com')).toBeInTheDocument();
  });

  it('shows "Never" for null last_session', () => {
    render(<UnscheduledClientsList clients={[mockClients[1]]} isLoading={false} />);
    expect(screen.getByText('Never')).toBeInTheDocument();
  });

  it('shows a formatted date for a non-null last_session', () => {
    render(<UnscheduledClientsList clients={[mockClients[0]]} isLoading={false} />);
    expect(screen.queryByText('Never')).not.toBeInTheDocument();
  });

  it('shows empty state message when clients is empty and not loading', () => {
    render(<UnscheduledClientsList clients={[]} isLoading={false} />);
    expect(screen.getByText('All clients have upcoming sessions.')).toBeInTheDocument();
  });

  it('does not show empty state while loading', () => {
    render(<UnscheduledClientsList clients={[]} isLoading={true} />);
    expect(screen.queryByText('All clients have upcoming sessions.')).not.toBeInTheDocument();
  });
});
