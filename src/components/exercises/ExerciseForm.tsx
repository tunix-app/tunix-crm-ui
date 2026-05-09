import React, { useState, useEffect, KeyboardEvent } from "react";
import { X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ApiError } from "@/lib/api";
import type { Exercise, CreateExerciseDto, UpdateExerciseDto, ExerciseFormState } from "@/types/exercise";

interface ExerciseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Exercise | null;
  onCreateExercise: (data: CreateExerciseDto) => Promise<Exercise>;
  onUpdateExercise: (id: string, data: UpdateExerciseDto) => Promise<Exercise>;
  onToast: (message: string, type?: "error" | "success") => void;
}

const emptyForm: ExerciseFormState = {
  name: "",
  description: "",
  tags: [],
  exercise_demo: "",
};

function toFormState(exercise: Exercise): ExerciseFormState {
  return {
    name: exercise.name,
    description: exercise.description ?? "",
    tags: exercise.tags,
    exercise_demo: exercise.exercise_demo ?? "",
  };
}

export function ExerciseForm({
  open,
  onOpenChange,
  defaultValues,
  onCreateExercise,
  onUpdateExercise,
  onToast,
}: ExerciseFormProps) {
  const [form, setForm] = useState<ExerciseFormState>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!defaultValues;

  useEffect(() => {
    if (open) {
      setForm(defaultValues ? toFormState(defaultValues) : emptyForm);
      setTagInput("");
      setFieldErrors({});
    }
  }, [open, defaultValues]);

  function validate(): boolean {
    const errors: { name?: string; general?: string } = {};
    if (!form.name.trim()) {
      errors.name = "Name is required.";
    } else if (form.name.trim().length > 255) {
      errors.name = "Name must be 255 characters or fewer.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && tagInput === "" && form.tags.length > 0) {
      removeTag(form.tags[form.tags.length - 1]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        tags: form.tags,
        exercise_demo: form.exercise_demo.trim() || null,
      };

      if (isEdit && defaultValues) {
        await onUpdateExercise(defaultValues.id, payload);
      } else {
        await onCreateExercise(payload);
      }
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setFieldErrors({ name: "Invalid input. Please check your entries." });
        } else if (err.status === 409) {
          onToast("An exercise with this name already exists.", "error");
        } else if (err.status === 403) {
          setFieldErrors({ general: "You don't have permission to perform this action." });
        } else {
          onToast("Something went wrong. Please try again.", "error");
        }
      } else {
        onToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Exercise" : "New Exercise"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {fieldErrors.general && (
            <p className="text-sm text-red-600">{fieldErrors.general}</p>
          )}

          <div className="space-y-1">
            <Label htmlFor="exercise-name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="exercise-name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Romanian Deadlift"
              disabled={isSubmitting}
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="exercise-description">Description</Label>
            <Textarea
              id="exercise-description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Optional description..."
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="exercise-tags">Tags</Label>
            <div className="flex flex-wrap gap-1 min-h-[38px] w-full rounded-md border border-gray-300 bg-white px-2 py-1 focus-within:ring-2 focus-within:ring-gray-400 focus-within:ring-offset-2">
              {form.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full hover:bg-gray-300 p-0.5"
                    disabled={isSubmitting}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
              <input
                id="exercise-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                placeholder={form.tags.length === 0 ? "Add tags (press Enter)..." : ""}
                className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-gray-400"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-400">Press Enter or comma to add a tag.</p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="exercise-demo">Demo URL</Label>
            <Input
              id="exercise-demo"
              value={form.exercise_demo}
              onChange={(e) => setForm((p) => ({ ...p, exercise_demo: e.target.value }))}
              placeholder="https://..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Exercise"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
