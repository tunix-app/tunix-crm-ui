import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProgramListItem } from './ProgramListItem';
import type { ProgramSummary } from '@/types/program';

const mockProgram: ProgramSummary = {
  id: 'prog-1',
  name: 'Phase 1 Strength',
  description: 'Foundation block',
  status: 'DRAFT',
  tags: [],
  client_id: 'client-1',
  client_name: 'Jane Doe',
  exercise_count: 6,
  created_at: '2026-05-24T10:00:00.000Z',
  updated_at: '2026-05-24T10:00:00.000Z',
};

describe('ProgramListItem', () => {
  it('renders program name, status badge, client name, and exercise count', () => {
    render(
      <ProgramListItem
        program={mockProgram}
        isActive={false}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('Phase 1 Strength')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('6 exercises')).toBeInTheDocument();
  });

  it('calls onSelect when the row is clicked', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <ProgramListItem
        program={mockProgram}
        isActive={false}
        onSelect={onSelect}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(container.querySelector('[role="button"]') as Element);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('shows confirmation dialog before calling onDelete', () => {
    const onDelete = vi.fn();
    render(
      <ProgramListItem
        program={mockProgram}
        isActive={false}
        onSelect={vi.fn()}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByLabelText('Delete program'));
    expect(screen.getByText('Delete Program')).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith('prog-1');
  });

  it('does not call onDelete when cancel is clicked in confirmation', () => {
    const onDelete = vi.fn();
    render(
      <ProgramListItem
        program={mockProgram}
        isActive={false}
        onSelect={vi.fn()}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByLabelText('Delete program'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('applies active styles when isActive is true', () => {
    const { container } = render(
      <ProgramListItem
        program={mockProgram}
        isActive={true}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(container.querySelector('[role="button"]')).toHaveClass('bg-accent');
  });
});
