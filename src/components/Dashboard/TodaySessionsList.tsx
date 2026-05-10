import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardSession, SessionType } from '@/types/dashboard';

type TodaySessionsListProps = {
  sessions: DashboardSession[];
  isLoading: boolean;
};

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  STRETCH: 'Stretch',
  TRAINING: 'Training',
  GROUP_TRAINING: 'Group Training',
  NEURO_RECON: 'Neuro Recon',
};

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function TodaySessionsList({ sessions, isLoading }: TodaySessionsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : sessions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
              No sessions scheduled for this day.
            </TableCell>
          </TableRow>
        ) : (
          sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-medium">{session.client_name}</TableCell>
              <TableCell>{SESSION_TYPE_LABELS[session.session_type]}</TableCell>
              <TableCell>{formatTime(session.start_time)}</TableCell>
              <TableCell>{formatTime(session.end_time)}</TableCell>
              <TableCell>{session.duration_minutes} min</TableCell>
              <TableCell>{session.description ?? '—'}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
