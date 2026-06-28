import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgramClientGroup } from './ProgramClientGroup';
import { ProgramCreateDialog } from './ProgramCreateDialog';
import type { ProgramSummary, CreateProgramDto, Program } from '@/types/program';

type ProgramListProps = {
  userId: string;
  programs: ProgramSummary[];
  isLoading: boolean;
  activeProgramId: string | null;
  onSelectProgram: (id: string) => void;
  onCreateProgram: (data: CreateProgramDto) => Promise<Program | null>;
  onDeleteProgram: (id: string) => Promise<void>;
};

type ClientGroup = {
  clientId: string;
  clientName: string;
  programs: ProgramSummary[];
};

function buildGroups(programs: ProgramSummary[], search: string): ClientGroup[] {
  const q = search.toLowerCase();
  const filtered = search
    ? programs.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.client_name.toLowerCase().includes(q),
      )
    : programs;

  const map: Record<string, ClientGroup> = {};
  for (const p of filtered) {
    if (!map[p.client_id]) {
      map[p.client_id] = { clientId: p.client_id, clientName: p.client_name, programs: [] };
    }
    map[p.client_id].programs.push(p);
  }

  return Object.values(map).sort((a, b) =>
    a.clientName.localeCompare(b.clientName),
  );
}

export function ProgramList({
  userId,
  programs,
  isLoading,
  activeProgramId,
  onSelectProgram,
  onCreateProgram,
  onDeleteProgram,
}: ProgramListProps) {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const groups = buildGroups(programs, search);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <Input
          placeholder="Search by program or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : groups.length === 0 ? (
          <p className="text-sm text-gray-500 text-center p-6">No programs found.</p>
        ) : (
          groups.map((group) => (
            <ProgramClientGroup
              key={group.clientId}
              clientName={group.clientName}
              programs={group.programs}
              activeProgramId={activeProgramId}
              onSelectProgram={onSelectProgram}
              onDeleteProgram={onDeleteProgram}
            />
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        <Button className="w-full" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Program
        </Button>
      </div>

      <ProgramCreateDialog
        userId={userId}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={onCreateProgram}
      />
    </div>
  );
}
