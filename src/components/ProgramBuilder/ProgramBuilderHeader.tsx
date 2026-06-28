import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProgramStatusBadge } from './ProgramStatusBadge';
import { ProgramTagList } from './ProgramTagList';
import { TagInput } from './TagInput';
import type { Program, UpdateProgramDto, ProgramStatus } from '@/types/program';

type ProgramBuilderHeaderProps = {
  program: Program;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onUpdate: (data: UpdateProgramDto) => Promise<void>;
  onExport: () => Promise<void>;
};

const statusTransitions: Record<ProgramStatus, ProgramStatus[]> = {
  DRAFT: ['DRAFT', 'READY'],
  READY: ['READY', 'IN_PROGRESS', 'DRAFT'],
  IN_PROGRESS: ['IN_PROGRESS', 'COMPLETE', 'DRAFT'],
  COMPLETE: [],
};

const statusLabels: Record<ProgramStatus, string> = {
  DRAFT: 'Draft',
  READY: 'Ready',
  IN_PROGRESS: 'In Progress',
  COMPLETE: 'Complete',
};

export function ProgramBuilderHeader({
  program,
  isEditMode,
  onToggleEditMode,
  onUpdate,
  onExport,
}: ProgramBuilderHeaderProps) {
  const [name, setName] = useState(program.name);
  const [description, setDescription] = useState(program.description ?? '');
  const [status, setStatus] = useState<ProgramStatus>(program.status);
  const [tags, setTags] = useState<string[]>(program.tags);
  const [notes, setNotes] = useState(program.notes ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setName(program.name);
    setDescription(program.description ?? '');
    setStatus(program.status);
    setTags(program.tags);
    setNotes(program.notes ?? '');
  }, [program]);

  async function handleSave() {
    const changed: UpdateProgramDto = {};
    if (name !== program.name) changed.name = name;
    if (description !== (program.description ?? '')) changed.description = description;
    if (status !== program.status) changed.status = status;
    const tagsChanged =
      tags.length !== program.tags.length || tags.some((t, i) => t !== program.tags[i]);
    if (tagsChanged) changed.tags = tags;
    if (notes !== (program.notes ?? '')) changed.notes = notes;

    if (Object.keys(changed).length === 0) {
      onToggleEditMode();
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(changed);
      onToggleEditMode();
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setName(program.name);
    setDescription(program.description ?? '');
    setStatus(program.status);
    setTags(program.tags);
    setNotes(program.notes ?? '');
    onToggleEditMode();
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  }

  const availableStatuses = statusTransitions[program.status];

  if (isEditMode) {
    return (
      <div className="p-6 border-b border-gray-200 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
          <Select
            value={status}
            onValueChange={(val) => setStatus(val as ProgramStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tags</label>
          <TagInput tags={tags} onChange={setTags} placeholder="e.g. Strength, Mobility..." />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving} size="sm">
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving} size="sm">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 truncate">{program.name}</h2>
            <ProgramStatusBadge status={program.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {program.description ?? <span className="italic">—</span>}
          </p>
          {program.tags.length > 0 && (
            <div className="mt-2">
              <ProgramTagList tags={program.tags} />
            </div>
          )}
          {program.notes && (
            <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded p-2">{program.notes}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">Client: {program.client_name}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {program.status === 'READY' && (
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
              <FileDown className="h-4 w-4 mr-1" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          )}
          {program.status !== 'COMPLETE' && (
            <Button variant="outline" size="sm" onClick={onToggleEditMode}>
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
