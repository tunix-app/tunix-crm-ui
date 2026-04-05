import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths } from 'date-fns';
import CalendarView from '../components/Calendar/CalendarView';
import type { Session } from '../components/Calendar/CalendarView';
import { NewSession } from '@/components/Calendar/scheduling/newSessionDialog';
import { EditSessionDialog } from '@/components/Calendar/scheduling/editSessionDialog';
import { sessionApi } from '@/lib/sessionApi';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Calendar = () => {
  const { userId } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editSessionId, setEditSessionId] = useState<string | null>(null);
  const [newSessionSlot, setNewSessionSlot] = useState<{ start: Date; end: Date } | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!userId) return;
    let start: Date;
    let end: Date;
    if (view === 'day') {
      start = new Date(currentDate); start.setHours(0, 0, 0, 0);
      end   = new Date(currentDate); end.setHours(23, 59, 59, 999);
    } else if (view === 'week') {
      start = startOfWeek(currentDate, { weekStartsOn: 1 });
      end   = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else {
      start = startOfMonth(currentDate);
      end   = endOfMonth(currentDate);
    }
    try {
      const data = await sessionApi.getSessionByTimeRange(userId, {
        start_range: start.toISOString(),
        end_range: end.toISOString(),
      });
      const list = Array.isArray(data) ? data : (data as any)?.sessions ?? (data as any)?.data ?? [];
      setSessions(list);
    } catch {
      setSessions([]);
    }
  }, [userId, currentDate, view]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const toSlotTime = (date: Date): string => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = date.getMinutes() >= 30 ? '30' : '00';
    return `${h}:${m}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
      </div>
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <Button onClick={() => setCurrentDate(new Date())} variant="blue" size="sm">
              Today
            </Button>
            <div className="flex items-center mx-4">
              <button
                onClick={() => {
                  if (view === 'day') setCurrentDate(d => addDays(d, -1));
                  else if (view === 'week') setCurrentDate(d => addWeeks(d, -1));
                  else setCurrentDate(d => addMonths(d, -1));
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="mx-4 font-medium">{formatDate(currentDate)}</h2>
              <button
                onClick={() => {
                  if (view === 'day') setCurrentDate(d => addDays(d, 1));
                  else if (view === 'week') setCurrentDate(d => addWeeks(d, 1));
                  else setCurrentDate(d => addMonths(d, 1));
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
            <NewSession onSuccess={fetchSessions} />
          </div>
        </div>
        <EditSessionDialog
          sessionId={editSessionId}
          open={editSessionId !== null}
          onClose={() => setEditSessionId(null)}
          onSuccess={fetchSessions}
        />
        <NewSession
          open={newSessionSlot !== null}
          onOpenChange={(o) => { if (!o) setNewSessionSlot(null); }}
          onSuccess={fetchSessions}
          initialStartDate={newSessionSlot?.start}
          initialStartTime={newSessionSlot ? toSlotTime(newSessionSlot.start) : undefined}
        />
        <div className="flex-1 overflow-y-auto">
          <CalendarView
            currentDate={currentDate}
            view={view}
            sessions={sessions}
            onSessionClick={setEditSessionId}
            onSlotClick={(start, end) => setNewSessionSlot({ start, end })}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
