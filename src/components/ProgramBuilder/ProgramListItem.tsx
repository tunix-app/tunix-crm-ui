import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProgramStatusBadge } from './ProgramStatusBadge';
import { ProgramTagList } from './ProgramTagList';
import type { ProgramSummary } from '@/types/program';

type ProgramListItemProps = {
  program: ProgramSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
};

export function ProgramListItem({
  program,
  isActive,
  onSelect,
  onDelete,
}: ProgramListItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmOpen(true);
  }

  function handleConfirmDelete() {
    setConfirmOpen(false);
    onDelete(program.id);
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => e.key === 'Enter' && onSelect()}
        className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-start justify-between gap-2 cursor-pointer ${
          isActive ? 'bg-accent' : ''
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{program.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <ProgramStatusBadge status={program.status} />
            <ProgramTagList tags={program.tags} size="sm" />
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">{program.client_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {program.exercise_count} {program.exercise_count === 1 ? 'exercise' : 'exercises'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="flex-shrink-0 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete program"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{program.name}&rdquo;? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
