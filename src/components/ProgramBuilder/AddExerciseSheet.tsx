import React, { useState, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getExercises } from '@/lib/exercises-api';
import type { Exercise } from '@/types/exercise';
import type { AddExerciseDto } from '@/types/program';

type AddExerciseSheetProps = {
  userId: string;
  programId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: AddExerciseDto) => Promise<void>;
};

type InlineForm = {
  sets: string;
  reps: string;
  durationSeconds: string;
  notes: string;
};

export function AddExerciseSheet({
  userId,
  open,
  onOpenChange,
  onAdd,
}: AddExerciseSheetProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<InlineForm>({
    sets: '',
    reps: '',
    durationSeconds: '',
    notes: '',
  });
  const [addingId, setAddingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    getExercises(userId, debouncedSearch || undefined)
      .then((data) => setExercises(data))
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, [userId, debouncedSearch, open]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      setExpandedId(null);
      setSuccessId(null);
    }
  }, [open]);

  function handleExpand(exerciseId: string) {
    if (expandedId === exerciseId) {
      setExpandedId(null);
    } else {
      setExpandedId(exerciseId);
      setForm({ sets: '', reps: '', durationSeconds: '', notes: '' });
    }
  }

  async function handleAdd(exercise: Exercise) {
    setAddingId(exercise.id.toString());
    try {
      const dto: AddExerciseDto = {
        exercise_id: exercise.id,
        sets: form.sets ? parseInt(form.sets, 10) : undefined,
        reps: form.reps || undefined,
        duration_seconds: form.durationSeconds
          ? parseInt(form.durationSeconds, 10)
          : undefined,
        notes: form.notes || undefined,
      };
      await onAdd(dto);
      setExpandedId(null);
      setSuccessId(exercise.id);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccessId(null), 2000);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Exercise</SheetTitle>
        </SheetHeader>

        <div className="mb-4">
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          ) : exercises.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No exercises found.</p>
          ) : (
            exercises.map((exercise) => {
              const id = exercise.id;
              const isExpanded = expandedId === id;
              const isSuccess = successId === id;

              return (
                <div
                  key={id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">{exercise.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exercise.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {isSuccess ? (
                      <span className="text-xs text-green-600 font-medium">Added!</span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleExpand(id)}
                        variant={isExpanded ? 'outline' : 'default'}
                      >
                        {isExpanded ? 'Cancel' : 'Add'}
                      </Button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 p-3 space-y-2 bg-gray-50">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Sets</label>
                          <Input
                            type="number"
                            min="0"
                            value={form.sets}
                            onChange={(e) => setForm((f) => ({ ...f, sets: e.target.value }))}
                            placeholder="e.g. 3"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Reps</label>
                          <Input
                            value={form.reps}
                            onChange={(e) => setForm((f) => ({ ...f, reps: e.target.value }))}
                            placeholder="e.g. 8-10"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Duration (s)</label>
                          <Input
                            type="number"
                            min="0"
                            value={form.durationSeconds}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, durationSeconds: e.target.value }))
                            }
                            placeholder="e.g. 30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Notes</label>
                        <Textarea
                          value={form.notes}
                          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                          rows={2}
                          placeholder="Optional notes..."
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleAdd(exercise)}
                        disabled={addingId === id}
                      >
                        {addingId === id ? 'Adding...' : 'Confirm Add'}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
