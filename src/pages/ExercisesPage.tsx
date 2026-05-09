import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExercises } from "@/hooks/useExercises";
import { ExerciseList } from "@/components/exercises/ExerciseList";
import { ExerciseForm } from "@/components/exercises/ExerciseForm";
import { ExerciseDeleteDialog } from "@/components/exercises/ExerciseDeleteDialog";
import { ExerciseDetail } from "@/components/exercises/ExerciseDetail";
import type { Exercise } from "@/types/exercise";

export default function ExercisesPage() {
  const {
    exercises,
    isLoading,
    error,
    search,
    setSearch,
    createExercise,
    updateExercise,
    deleteExercise,
    toasts,
    addToast,
    dismissToast,
  } = useExercises();

  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  function handleNewExercise() {
    setSelectedExercise(null);
    setFormOpen(true);
  }

  function handleEdit(exercise: Exercise) {
    setSelectedExercise(exercise);
    setFormOpen(true);
  }

  function handleView(exercise: Exercise) {
    setSelectedExercise(exercise);
    setDetailOpen(true);
  }

  function handleDelete(exercise: Exercise) {
    setSelectedExercise(exercise);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exercise Catalog</h1>
        <p className="text-sm text-gray-500 mt-1">
          Build and manage your personal library of exercises.
        </p>
      </div>

      <ExerciseList
        exercises={exercises}
        isLoading={isLoading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onNewExercise={handleNewExercise}
      />

      <ExerciseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultValues={selectedExercise}
        onCreateExercise={createExercise}
        onUpdateExercise={updateExercise}
        onToast={addToast}
      />

      <ExerciseDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        exercise={selectedExercise}
        onDeleteExercise={deleteExercise}
        onToast={addToast}
      />

      <ExerciseDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        exercise={selectedExercise}
      />

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm max-w-sm",
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-green-50 border-green-200 text-green-800"
            )}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
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
