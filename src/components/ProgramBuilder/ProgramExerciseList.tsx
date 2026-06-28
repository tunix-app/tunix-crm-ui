import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProgramExerciseItem } from './ProgramExerciseItem';
import type { ProgramExercise, UpdateProgramExerciseDto, ReorderExercisesDto } from '@/types/program';

type ProgramExerciseListProps = {
  exercises: ProgramExercise[];
  isEditMode: boolean;
  onUpdate: (id: string, data: UpdateProgramExerciseDto) => Promise<void>;
  onRemove: (id: string) => void;
  onReorder: (data: ReorderExercisesDto) => Promise<void>;
};

type SortableExerciseItemProps = {
  exercise: ProgramExercise;
  isEditMode: boolean;
  onUpdate: (id: string, data: UpdateProgramExerciseDto) => Promise<void>;
  onRemove: (id: string) => void;
};

function SortableExerciseItem({
  exercise,
  isEditMode,
  onUpdate,
  onRemove,
}: SortableExerciseItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: exercise.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ProgramExerciseItem
        exercise={exercise}
        isEditMode={isEditMode}
        dragHandleProps={{ ...attributes, ...listeners }}
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    </div>
  );
}

export function ProgramExerciseList({
  exercises,
  isEditMode,
  onUpdate,
  onRemove,
  onReorder,
}: ProgramExerciseListProps) {
  const sorted = [...exercises].sort((a, b) => a.order_index - b.order_index);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex((e) => e.id === active.id);
    const newIndex = sorted.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);

    onReorder({
      exercises: reordered.map((e, idx) => ({ id: e.id, order_index: idx })),
    });
  }

  if (exercises.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-8">
        {isEditMode ? 'No exercises added yet.' : 'This program has no exercises.'}
      </p>
    );
  }

  if (!isEditMode) {
    return (
      <div className="space-y-3">
        {sorted.map((exercise) => (
          <ProgramExerciseItem
            key={exercise.id}
            exercise={exercise}
            isEditMode={false}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sorted.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sorted.map((exercise) => (
            <SortableExerciseItem
              key={exercise.id}
              exercise={exercise}
              isEditMode={isEditMode}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
