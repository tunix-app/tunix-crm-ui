import React, { useState } from 'react';
import { GripVertical, Trash2, Save, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProgramExercise, UpdateProgramExerciseDto } from '@/types/program';

type ProgramExerciseItemProps = {
  exercise: ProgramExercise;
  isEditMode: boolean;
  dragHandleProps?: Record<string, unknown>;
  onUpdate: (id: string, data: UpdateProgramExerciseDto) => Promise<void>;
  onRemove: (id: string) => void;
};

function formatSummary(exercise: ProgramExercise): string {
  const parts: string[] = [];
  if (exercise.sets) parts.push(`${exercise.sets} set${exercise.sets !== 1 ? 's' : ''}`);
  if (exercise.reps) parts.push(`${exercise.reps} reps`);
  if (exercise.duration_seconds) parts.push(`${exercise.duration_seconds}s`);
  return parts.join(' × ');
}

export function ProgramExerciseItem({
  exercise,
  isEditMode,
  dragHandleProps,
  onUpdate,
  onRemove,
}: ProgramExerciseItemProps) {
  const [sets, setSets] = useState(exercise.sets?.toString() ?? '');
  const [reps, setReps] = useState(exercise.reps ?? '');
  const [durationSeconds, setDurationSeconds] = useState(
    exercise.duration_seconds?.toString() ?? '',
  );
  const [notes, setNotes] = useState(exercise.notes ?? '');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const changed: UpdateProgramExerciseDto = {};
    const parsedSets = sets ? parseInt(sets, 10) : undefined;
    const parsedDuration = durationSeconds ? parseInt(durationSeconds, 10) : undefined;

    if (parsedSets !== (exercise.sets ?? undefined)) changed.sets = parsedSets;
    if (reps !== (exercise.reps ?? '')) changed.reps = reps || undefined;
    if (parsedDuration !== (exercise.duration_seconds ?? undefined))
      changed.duration_seconds = parsedDuration;
    if (notes !== (exercise.notes ?? '')) changed.notes = notes || undefined;

    setIsSaving(true);
    try {
      await onUpdate(exercise.id, changed);
    } finally {
      setIsSaving(false);
    }
  }

  const summary = formatSummary(exercise);

  return (
    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-white">
      {isEditMode && dragHandleProps && (
        <span
          {...dragHandleProps}
          className="flex-shrink-0 mt-1 cursor-grab text-gray-400 hover:text-gray-600"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{exercise.exercise_name}</span>
          {exercise.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {!isEditMode && (
          <>
            {summary && <p className="text-sm text-gray-600 mt-1">{summary}</p>}
            {exercise.notes && <p className="text-sm text-gray-500 mt-1">{exercise.notes}</p>}
            {exercise.exercise_demo && (
              <a
                href={exercise.exercise_demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
              >
                <ExternalLink className="h-3 w-3" />
                Demo
              </a>
            )}
          </>
        )}

        {isEditMode && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Sets</label>
                <Input
                  type="number"
                  min="0"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="e.g. 3"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Reps</label>
                <Input
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="e.g. 8-10"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Duration (s)</label>
                <Input
                  type="number"
                  min="0"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                  placeholder="e.g. 30"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Per-exercise notes..."
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {isEditMode && (
        <div className="flex-shrink-0 flex gap-1 mt-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving}
            aria-label="Save exercise"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => onRemove(exercise.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            aria-label="Remove exercise"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
