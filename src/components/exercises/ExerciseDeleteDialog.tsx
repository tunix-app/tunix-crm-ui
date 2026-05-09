import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import type { Exercise } from "@/types/exercise";

interface ExerciseDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: Exercise | null;
  onDeleteExercise: (id: string) => Promise<void>;
  onToast: (message: string, type?: "error" | "success") => void;
}

export function ExerciseDeleteDialog({
  open,
  onOpenChange,
  exercise,
  onDeleteExercise,
  onToast,
}: ExerciseDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    if (!exercise) return;
    setIsDeleting(true);
    try {
      await onDeleteExercise(exercise.id);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          onToast("This exercise is used in a program and cannot be deleted.", "error");
        } else if (err.status === 404) {
          onToast("Exercise not found.", "error");
          onOpenChange(false);
        } else {
          onToast("Something went wrong. Please try again.", "error");
        }
      } else {
        onToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Delete Exercise</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>{exercise?.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
