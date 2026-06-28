import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';
import { usePrograms } from '@/hooks/usePrograms';
import { useProgramDetail } from '@/hooks/useProgramDetail';
import { ProgramList } from '@/components/ProgramBuilder/ProgramList';
import { ProgramBuilderHeader } from '@/components/ProgramBuilder/ProgramBuilderHeader';
import { ProgramExerciseList } from '@/components/ProgramBuilder/ProgramExerciseList';
import { AddExerciseSheet } from '@/components/ProgramBuilder/AddExerciseSheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProgramBuilderPage() {
  const { userId } = useUser();

  const {
    programs,
    isLoading: listLoading,
    selectedClientId,
    setSelectedClientId,
    activeProgramId,
    setActiveProgramId,
    createProgram,
    deleteProgram,
    toasts: listToasts,
    dismissToast: dismissListToast,
  } = usePrograms();

  const {
    program,
    isLoading: detailLoading,
    isEditMode,
    setIsEditMode,
    updateProgram,
    addExercise,
    updateExercise,
    removeExercise,
    reorderExercises,
    exportProgram,
    toasts: detailToasts,
    dismissToast: dismissDetailToast,
  } = useProgramDetail(activeProgramId);

  const [addExerciseSheetOpen, setAddExerciseSheetOpen] = useState(false);

  if (!userId) return null;

  return (
    <div className="h-full flex gap-0">
      <div className="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col h-full">
        <ProgramList
          userId={userId}
          programs={programs}
          isLoading={listLoading}
          selectedClientId={selectedClientId}
          onClientFilterChange={setSelectedClientId}
          activeProgramId={activeProgramId}
          onSelectProgram={setActiveProgramId}
          onCreateProgram={createProgram}
          onDeleteProgram={deleteProgram}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {program ? (
          <>
            <ProgramBuilderHeader
              program={program}
              isEditMode={isEditMode}
              onToggleEditMode={() => setIsEditMode(!isEditMode)}
              onUpdate={updateProgram}
              onExport={exportProgram}
            />
            <div className="flex-1 overflow-y-auto p-6">
              <ProgramExerciseList
                exercises={program.exercises}
                isEditMode={isEditMode}
                onUpdate={updateExercise}
                onRemove={removeExercise}
                onReorder={reorderExercises}
              />
              {isEditMode && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setAddExerciseSheetOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              )}
            </div>
            <AddExerciseSheet
              userId={userId}
              programId={program.id}
              open={addExerciseSheetOpen}
              onOpenChange={setAddExerciseSheetOpen}
              onAdd={addExercise}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            {listLoading || detailLoading ? (
              <div className="space-y-3 w-64">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p>Select a program from the sidebar or create a new one.</p>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {listToasts.map((toast) => (
          <div
            key={`list-${toast.id}`}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm max-w-sm',
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-green-50 border-green-200 text-green-800',
            )}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => dismissListToast(toast.id)}
              className="flex-shrink-0 opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {detailToasts.map((toast) => (
          <div
            key={`detail-${toast.id}`}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm max-w-sm',
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-green-50 border-green-200 text-green-800',
            )}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => dismissDetailToast(toast.id)}
              className="flex-shrink-0 opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
