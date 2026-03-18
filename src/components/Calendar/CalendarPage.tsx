import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths } from 'date-fns'
import CalendarView from './CalendarView'
import type { Session } from './CalendarView'
import { NewSession } from './scheduling/newSessionDialog'
import { sessionApi } from '@/lib/sessionApi'
import { useUser } from '@/context/UserContext'

export default function CalendarPage() {
  const { userId } = useUser()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week' | 'month'>('week')
  const [sessions, setSessions] = useState<Session[]>([])

  const fetchSessions = useCallback(async () => {
    if (!userId) return
    let start: Date
    let end: Date
    if (view === 'day') {
      start = new Date(currentDate); start.setHours(0, 0, 0, 0)
      end   = new Date(currentDate); end.setHours(23, 59, 59, 999)
    } else if (view === 'week') {
      start = startOfWeek(currentDate, { weekStartsOn: 1 })
      end   = endOfWeek(currentDate, { weekStartsOn: 1 })
    } else {
      start = startOfMonth(currentDate)
      end   = endOfMonth(currentDate)
    }
    try {
      const data = await sessionApi.getSessionByTimeRange(userId, {
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      })
      setSessions(data ?? [])
    } catch {
      setSessions([])
    }
  }, [userId, currentDate, view])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const navigatePrevious = () => {
    if (view === 'day') setCurrentDate(d => addDays(d, -1))
    else if (view === 'week') setCurrentDate(d => addWeeks(d, -1))
    else setCurrentDate(d => addMonths(d, -1))
  }

  const navigateNext = () => {
    if (view === 'day') setCurrentDate(d => addDays(d, 1))
    else if (view === 'week') setCurrentDate(d => addWeeks(d, 1))
    else setCurrentDate(d => addMonths(d, 1))
  }

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
              <button onClick={navigatePrevious} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft size={20} />
              </button>
              <h2 className="mx-4 font-medium">{formatDate(currentDate)}</h2>
              <button onClick={navigateNext} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-1 rounded-md flex">
              {(['day', 'week', 'month'] as const).map(v => (
                <button
                  key={v}
                  className={`px-3 py-1 text-sm rounded-md capitalize ${view === v ? 'bg-white shadow' : ''}`}
                  onClick={() => setView(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <SlidersHorizontal size={18} />
            </button>
            <NewSession onSuccess={fetchSessions} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <CalendarView currentDate={currentDate} view={view} sessions={sessions} />
        </div>
      </div>
    </div>
  )
}
