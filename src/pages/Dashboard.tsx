import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardStats } from '@/components/Dashboard/DashboardStats';
import { TodaySessionsList } from '@/components/Dashboard/TodaySessionsList';
import { UnscheduledClientsList } from '@/components/Dashboard/UnscheduledClientsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const {
    dashboard,
    weekSessions,
    isLoading,
    error,
    toasts,
    dismissToast,
  } = useDashboard();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <DashboardStats
        totalSessionsToday={dashboard?.total_sessions_today ?? 0}
        totalActiveClients={dashboard?.total_active_clients ?? 0}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TodaySessionsList
            sessions={weekSessions}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Clients Without Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <UnscheduledClientsList
            clients={dashboard?.unscheduled_clients ?? []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm max-w-sm',
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-green-50 border-green-200 text-green-800'
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
