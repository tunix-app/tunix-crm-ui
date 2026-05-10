import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type DashboardStatsProps = {
  totalSessionsToday: number;
  totalActiveClients: number;
  isLoading: boolean;
};

export function DashboardStats({ totalSessionsToday, totalActiveClients, isLoading }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-gray-500">Sessions Today</p>
          {isLoading ? (
            <Skeleton className="h-9 w-16 mt-1 rounded" />
          ) : (
            <p className="text-4xl font-bold mt-1">{totalSessionsToday}</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-gray-500">Active Clients</p>
          {isLoading ? (
            <Skeleton className="h-9 w-16 mt-1 rounded" />
          ) : (
            <p className="text-4xl font-bold mt-1">{totalActiveClients}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
