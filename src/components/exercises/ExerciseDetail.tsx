import React from "react";
import { ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { Exercise } from "@/types/exercise";

interface ExerciseDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: Exercise | null;
}

export function ExerciseDetail({ open, onOpenChange, exercise }: ExerciseDetailProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {exercise ? (
          <>
            <SheetHeader>
              <SheetTitle>{exercise.name}</SheetTitle>
              {exercise.description && (
                <SheetDescription>{exercise.description}</SheetDescription>
              )}
            </SheetHeader>

            <div className="space-y-6">
              {exercise.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {exercise.exercise_demo && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Demo
                  </p>
                  <a
                    href={exercise.exercise_demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Watch Demo
                  </a>
                </div>
              )}

              {!exercise.description && exercise.tags.length === 0 && !exercise.exercise_demo && (
                <p className="text-sm text-gray-400 italic">No additional details.</p>
              )}
            </div>
          </>
        ) : (
          <SheetHeader>
            <SheetTitle>Exercise Details</SheetTitle>
            <SheetDescription>No exercise selected.</SheetDescription>
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  );
}
