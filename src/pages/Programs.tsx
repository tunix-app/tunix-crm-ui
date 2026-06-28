import React, { useState } from 'react';
import { Plus, LayoutList, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';
import { usePrograms } from '@/hooks/usePrograms';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ProgramCreateDialog } from '@/components/ProgramBuilder/ProgramCreateDialog';
import { ProgramStatusBadge } from '@/components/ProgramBuilder/ProgramStatusBadge';
import { ProgramTagList } from '@/components/ProgramBuilder/ProgramTagList';
import type { ProgramSummary } from '@/types/program';

type ProgramCardProps = {
  program: ProgramSummary;
  onDelete: () => void;
};

function ProgramCard({ program, onDelete }: ProgramCardProps) {
  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete();
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{program.name}</h3>
            <ProgramStatusBadge status={program.status} />
          </div>
          {program.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{program.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs text-gray-400">
              {program.exercise_count}{' '}
              {program.exercise_count === 1 ? 'exercise' : 'exercises'}
            </span>
            {program.tags.length > 0 && <ProgramTagList tags={program.tags} size="sm" />}
          </div>
        </div>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="flex-shrink-0 p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete program"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

type ClientGroup = {
  clientId: string;
  clientName: string;
  programs: ProgramSummary[];
};

function groupByClient(programs: ProgramSummary[]): ClientGroup[] {
  const map: Record<string, ClientGroup> = {};
  for (const p of programs) {
    if (!map[p.client_id]) {
      map[p.client_id] = { clientId: p.client_id, clientName: p.client_name, programs: [] };
    }
    map[p.client_id].programs.push(p);
  }
  return Object.values(map).sort((a, b) => a.clientName.localeCompare(b.clientName));
}

export default function ProgramsPage() {
  const { userId } = useUser();
  const [createOpen, setCreateOpen] = useState(false);

  const { programs, isLoading, createProgram, deleteProgram, toasts, dismissToast } =
    usePrograms();

  if (!userId) return null;

  const clientGroups = groupByClient(programs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Programs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {programs.length > 0
              ? `${programs.length} program${programs.length === 1 ? '' : 's'} across your clients`
              : 'Manage training programs for your clients'}
          </p>
        </div>
        {programs.length > 0 && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Program
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : clientGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-20 text-center">
          <LayoutList className="h-10 w-10 text-gray-300 mb-3" />
          <h2 className="text-base font-semibold text-gray-700 mb-1">No programs yet</h2>
          <p className="text-sm text-gray-500 max-w-xs mb-5">
            Create training programs for your clients and track their progress.
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Program
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {clientGroups.map((group) => (
            <div key={group.clientId}>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                {group.clientName}
              </h2>
              <div className="space-y-3">
                {group.programs.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    onDelete={() => deleteProgram(program.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ProgramCreateDialog
        userId={userId}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createProgram}
      />

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm max-w-sm',
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-green-50 border-green-200 text-green-800',
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
