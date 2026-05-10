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
import type { UnscheduledClient } from '@/types/dashboard';

type UnscheduledClientsListProps = {
  clients: UnscheduledClient[];
  isLoading: boolean;
};

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function UnscheduledClientsList({ clients, isLoading }: UnscheduledClientsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Last Session</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 3 }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : clients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-gray-500 py-8">
              All clients have upcoming sessions.
            </TableCell>
          </TableRow>
        ) : (
          clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.client_name}</TableCell>
              <TableCell>{client.client_email}</TableCell>
              <TableCell>
                {client.last_session ? formatDate(client.last_session) : 'Never'}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
