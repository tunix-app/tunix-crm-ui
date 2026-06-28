import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ProgramStatus } from '@/types/program';

type ProgramStatusBadgeProps = {
  status: ProgramStatus;
};

const statusConfig: Record<ProgramStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: '' },
  READY: { label: 'Ready', className: 'bg-green-100 text-green-800 border-green-200' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  COMPLETE: { label: 'Complete', className: 'bg-purple-100 text-purple-800 border-purple-200' },
};

export function ProgramStatusBadge({ status }: ProgramStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant={status === 'DRAFT' ? 'secondary' : 'outline'}
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}
