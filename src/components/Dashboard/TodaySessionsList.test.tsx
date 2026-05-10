import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TodaySessionsList } from './TodaySessionsList';
import type { DashboardSession } from '@/types/dashboard';

const mockSessions: DashboardSession[] = [
  {
    id: '1',
    client_id: 'c1',
    client_name: 'Alice Smith',
    session_type: 'TRAINING',
    start_time: '2026-05-09T09:00:00.000Z',
    end_time: '2026-05-09T10:00:00.000Z',
    duration_minutes: 60,
    description: 'Leg day',
  },
  {
    id: '2',
    client_id: 'c2',
    client_name: 'Bob Jones',
    session_type: 'NEURO_RECON',
    start_time: '2026-05-09T11:00:00.000Z',
    end_time: '2026-05-09T11:45:00.000Z',
    duration_minutes: 45,
    description: null,
  },
];

describe('TodaySessionsList', () => {
  it('renders all columns for each session', () => {
    render(<TodaySessionsList sessions={mockSessions} isLoading={false} />);

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
    expect(screen.getByText('Leg day')).toBeInTheDocument();

    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Neuro Recon')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('shows empty state message when sessions is empty and not loading', () => {
    render(<TodaySessionsList sessions={[]} isLoading={false} />);
    expect(screen.getByText('No sessions scheduled for this day.')).toBeInTheDocument();
  });

  it('does not show empty state while loading', () => {
    render(<TodaySessionsList sessions={[]} isLoading={true} />);
    expect(screen.queryByText('No sessions scheduled for this day.')).not.toBeInTheDocument();
  });
});
