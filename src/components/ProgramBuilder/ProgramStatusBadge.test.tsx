import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgramStatusBadge } from './ProgramStatusBadge';

describe('ProgramStatusBadge', () => {
  it('renders "Draft" label for DRAFT status', () => {
    render(<ProgramStatusBadge status="DRAFT" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders "Ready" label for READY status', () => {
    render(<ProgramStatusBadge status="READY" />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('renders "In Progress" label for IN_PROGRESS status', () => {
    render(<ProgramStatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders "Complete" label for COMPLETE status', () => {
    render(<ProgramStatusBadge status="COMPLETE" />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('applies secondary variant for DRAFT', () => {
    const { container } = render(<ProgramStatusBadge status="DRAFT" />);
    expect(container.firstChild).toHaveClass('bg-gray-100');
  });

  it('applies green color class for READY', () => {
    const { container } = render(<ProgramStatusBadge status="READY" />);
    expect(container.firstChild).toHaveClass('bg-green-100');
  });

  it('applies blue color class for IN_PROGRESS', () => {
    const { container } = render(<ProgramStatusBadge status="IN_PROGRESS" />);
    expect(container.firstChild).toHaveClass('bg-blue-100');
  });

  it('applies purple color class for COMPLETE', () => {
    const { container } = render(<ProgramStatusBadge status="COMPLETE" />);
    expect(container.firstChild).toHaveClass('bg-purple-100');
  });
});
