import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ProgramListItem } from './ProgramListItem';
import type { ProgramSummary } from '@/types/program';

type ProgramClientGroupProps = {
  clientName: string;
  programs: ProgramSummary[];
  activeProgramId: string | null;
  onSelectProgram: (id: string) => void;
  onDeleteProgram: (id: string) => Promise<void>;
};

export function ProgramClientGroup({
  clientName,
  programs,
  activeProgramId,
  onSelectProgram,
  onDeleteProgram,
}: ProgramClientGroupProps) {
  const hasActive = programs.some((p) => p.id === activeProgramId);
  const [isExpanded, setIsExpanded] = useState(true);

  // Stay expanded whenever a program in this group is active
  const expanded = isExpanded || hasActive;

  function handleToggle() {
    // Don't collapse if an active program lives in this group
    if (hasActive) return;
    setIsExpanded((prev) => !prev);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-left border-b border-gray-200"
      >
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide truncate">
          {clientName}{' '}
          <span className="font-normal normal-case text-gray-400">({programs.length})</span>
        </span>
        {hasActive ? null : expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div>
          {programs.map((program) => (
            <ProgramListItem
              key={program.id}
              program={program}
              isActive={program.id === activeProgramId}
              onSelect={() => onSelectProgram(program.id)}
              onDelete={onDeleteProgram}
            />
          ))}
        </div>
      )}
    </div>
  );
}
