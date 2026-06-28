import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProgramExerciseList } from './ProgramExerciseList';
import type { ProgramExercise } from '@/types/program';

const exercises: ProgramExercise[] = [
  {
    id: 'pe-1',
    exercise_id: 'ex-1',
    exercise_name: 'Squat',
    exercise_demo: null,
    tags: ['strength'],
    order_index: 0,
    sets: 3,
    reps: '8-10',
    duration_seconds: null,
    notes: null,
  },
  {
    id: 'pe-2',
    exercise_id: 'ex-2',
    exercise_name: 'Deadlift',
    exercise_demo: null,
    tags: ['strength', 'posterior chain'],
    order_index: 1,
    sets: 4,
    reps: '5',
    duration_seconds: null,
    notes: 'Keep back straight',
  },
];

const defaultProps = {
  onUpdate: vi.fn(),
  onRemove: vi.fn(),
  onReorder: vi.fn(),
};

describe('ProgramExerciseList', () => {
  it('renders all exercises in order_index order', () => {
    render(
      <ProgramExerciseList
        exercises={exercises}
        isEditMode={false}
        {...defaultProps}
      />,
    );

    const items = screen.getAllByText(/Squat|Deadlift/);
    expect(items[0]).toHaveTextContent('Squat');
    expect(items[1]).toHaveTextContent('Deadlift');
  });

  it('shows "No exercises added yet." when empty in Edit mode', () => {
    render(
      <ProgramExerciseList
        exercises={[]}
        isEditMode={true}
        {...defaultProps}
      />,
    );

    expect(screen.getByText('No exercises added yet.')).toBeInTheDocument();
  });

  it('shows "This program has no exercises." when empty in View mode', () => {
    render(
      <ProgramExerciseList
        exercises={[]}
        isEditMode={false}
        {...defaultProps}
      />,
    );

    expect(screen.getByText('This program has no exercises.')).toBeInTheDocument();
  });

  it('renders drag handles in Edit mode', () => {
    render(
      <ProgramExerciseList
        exercises={exercises}
        isEditMode={true}
        {...defaultProps}
      />,
    );

    const dragHandles = screen.getAllByLabelText('Drag to reorder');
    expect(dragHandles).toHaveLength(2);
  });

  it('does not render drag handles in View mode', () => {
    render(
      <ProgramExerciseList
        exercises={exercises}
        isEditMode={false}
        {...defaultProps}
      />,
    );

    expect(screen.queryByLabelText('Drag to reorder')).not.toBeInTheDocument();
  });
});
