import React, { useMemo } from 'react'
import { format, isSameDay, startOfWeek, addDays } from 'date-fns'

export interface Session {
  id: string
  client_id: string
  client_name: string
  session_type: string
  start_date: string
  end_date: string
  tools_used?: string[]
}

interface CalendarViewProps {
  currentDate: Date
  view: 'day' | 'week' | 'month'
  sessions: Session[]
}

// Each entry: [block classes, pill classes]
const SESSION_COLORS: Record<string, [string, string]> = {
  'Stretch':                      ['bg-green-100  border-green-600  text-green-950',  'bg-green-200  text-green-900'],
  'Personal Training':            ['bg-blue-100   border-blue-600   text-blue-950',   'bg-blue-200   text-blue-900'],
  'Group Training':               ['bg-violet-100 border-violet-600 text-violet-950', 'bg-violet-200 text-violet-900'],
  'Neuromuscular Reconstruction': ['bg-amber-100  border-amber-500  text-amber-950',  'bg-amber-200  text-amber-900'],
}
const FALLBACK_COLOR: [string, string] = ['bg-gray-100 border-gray-500 text-gray-950', 'bg-gray-200 text-gray-900']

function sessionColor(type: string): [string, string] {
  return SESSION_COLORS[type] ?? FALLBACK_COLOR
}

const HOUR_START = 7   // 7 AM
const HOUR_COUNT = 15  // 7 AM → 9 PM

function isHourPast(date: Date, hour: number): boolean {
  const now = new Date()
  if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return true
  return isSameDay(date, now) && hour < now.getHours()
}

function isDayPast(date: Date): boolean {
  const now = new Date()
  return date < new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const CalendarView = ({ currentDate, view, sessions = [] }: CalendarViewProps) => {
  const timeSlots = Array.from({ length: HOUR_COUNT }, (_, i) => {
    const hour = HOUR_START + i
    const h12 = hour % 12 === 0 ? 12 : hour % 12
    const suffix = hour < 12 ? 'AM' : 'PM'
    return { label: `${h12}:00 ${suffix}`, hour }
  })

  const parsed = useMemo(() => {
    return sessions.flatMap(s => {
      const start = new Date(s.start_date)
      const end = new Date(s.end_date)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.warn('[CalendarView] skipping session with invalid dates', s)
        return []
      }
      return [{
        ...s,
        startDate: start,
        endDate: end,
        startH: start.getHours(),
        startM: start.getMinutes(),
        durationMins: (end.getTime() - start.getTime()) / 60000,
        timeLabel: `${format(start, 'h:mm')}–${format(end, 'h:mm a')}`,
        color: sessionColor(s.session_type),
      }]
    })
  }, [sessions])

  const weekDays = useMemo(() => {
    const monday = startOfWeek(currentDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
  }, [currentDate])

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: { date: Date; currentMonth: boolean }[] = []
    // Pad from previous month (Sun-start grid)
    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), currentMonth: false })
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), currentMonth: true })
    }
    for (let i = 1; days.length < 42; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false })
    }
    return days
  }, [currentDate])

  // Renders event blocks for a given date within the time-slot grid
  function renderSlots(date: Date, compact: boolean) {
    const daySessions = parsed.filter(s => isSameDay(s.startDate, date))
    return timeSlots.map(({ hour }, i) => (
      <div key={i} className={`h-24 border-t border-gray-200 relative ${isHourPast(date, hour) ? 'bg-gray-50' : ''}`}>
        {daySessions
          .filter(s => s.startH === hour)
          .map(s => (
            <div
              key={s.id}
              className={`absolute rounded-sm cursor-pointer overflow-hidden ${s.color[0]} ${
                compact
                  ? 'left-0 right-0 mx-1 border-l-2 p-1 text-xs'
                  : 'left-16 right-4 border-l-4 p-2'
              } ${isDayPast(s.startDate) || isHourPast(s.startDate, s.startH) ? 'opacity-50' : ''}`}
              style={{
                top: `${s.startM / 60 * 100}%`,
                height: `${s.durationMins / 60 * 100}%`,
                maxHeight: '95%',
              }}
            >
              <div className={`truncate font-medium ${compact ? '' : 'text-sm'}`}>
                {s.session_type}
              </div>
              <div className="truncate text-gray-600">{s.client_name}</div>
              {!compact && <div className="text-xs text-gray-500">{s.timeLabel}</div>}
              {compact && s.tools_used && s.tools_used.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-1">
                  {s.tools_used.map(tool => (
                    <span key={tool} className="inline-block bg-white/60 text-current px-1 py-0.5 rounded-full leading-tight truncate max-w-[80px]" style={{ fontSize: '9px' }}>
                      {tool}
                    </span>
                  ))}
                </div>
              )}
              {!compact && s.tools_used && s.tools_used.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {s.tools_used.map(tool => (
                    <span key={tool} className="inline-block bg-white/60 text-current text-xs px-1.5 py-0.5 rounded-full leading-tight truncate max-w-[120px]">
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    ))
  }

  const renderCalendar = () => {
    switch (view) {
      case 'day':
        return (
          <div className="h-full">
            <div className="grid grid-cols-1 h-full">
              {timeSlots.map(({ label }, i) => (
                <div key={i} className={`border-b border-gray-200 relative h-24 ${isHourPast(currentDate, HOUR_START + i) ? 'bg-gray-50' : ''}`}>
                  <div className={`absolute left-0 -top-3 text-xs px-2 ${isHourPast(currentDate, HOUR_START + i) ? 'text-gray-400 bg-gray-50' : 'text-gray-500 bg-white'}`}>
                    {label}
                  </div>
                  {parsed
                    .filter(s => isSameDay(s.startDate, currentDate) && s.startH === HOUR_START + i)
                    .map(s => (
                      <div
                        key={s.id}
                        className={`absolute left-16 right-4 border-l-4 p-2 rounded-md cursor-pointer overflow-hidden ${s.color[0]} ${isDayPast(s.startDate) || isHourPast(s.startDate, s.startH) ? 'opacity-50' : ''}`}
                        style={{
                          top: `${s.startM / 60 * 100}%`,
                          height: `${s.durationMins / 60 * 100}%`,
                          maxHeight: '95%',
                        }}
                      >
                        <div className="font-medium text-sm truncate">{s.session_type}</div>
                        <div className="text-xs text-gray-600 truncate">{s.client_name}</div>
                        <div className="text-xs text-gray-500">{s.timeLabel}</div>
                        {s.tools_used && s.tools_used.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {s.tools_used.map(tool => (
                              <span key={tool} className="inline-block bg-white/60 text-current text-xs px-1.5 py-0.5 rounded-full leading-tight truncate max-w-[140px]">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )

      case 'week':
        return (
          <div className="h-full">
            <div className="grid grid-cols-8 h-full border-b">
              {/* Time gutter */}
              <div className="border-r border-gray-200 pt-16">
                {timeSlots.map(({ label }, i) => (
                  <div key={i} className="h-24 border-t border-gray-200 text-xs text-gray-500 px-2">
                    {label}
                  </div>
                ))}
              </div>
              {/* Day columns */}
              {weekDays.map((date, di) => (
                <div key={di} className="border-r border-gray-200 flex flex-col">
                  <div className="h-16 border-b border-gray-200 flex flex-col items-center justify-center shrink-0 gap-0.5">
                    <span className={`text-xs font-medium uppercase tracking-wide ${
                      isSameDay(date, new Date()) ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className={`text-xl font-semibold w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                      isSameDay(date, new Date())
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-800 hover:bg-gray-100'
                    }`}>
                      {date.getDate()}
                    </span>
                  </div>
                  {renderSlots(date, true)}
                </div>
              ))}
            </div>
          </div>
        )

      case 'month':
        return (
          <div className="h-full">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="bg-gray-100 p-2 text-center text-sm font-medium">{d}</div>
              ))}
              {monthDays.map(({ date, currentMonth }, i) => {
                const daySessions = parsed.filter(s => isSameDay(s.startDate, date))
                const isToday = isSameDay(date, new Date())
                const past = currentMonth && isDayPast(date)
                return (
                  <div
                    key={i}
                    className={`p-2 h-32 ${past || !currentMonth ? 'bg-gray-50' : 'bg-white'} ${!currentMonth ? 'text-gray-400' : ''} ${
                      isToday ? 'ring-2 ring-inset ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">{date.getDate()}</span>
                      {currentMonth && daySessions.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-1.5 rounded-full">
                          {daySessions.length}
                        </span>
                      )}
                    </div>
                    {currentMonth && (
                      <div className="mt-1 space-y-0.5 overflow-hidden">
                        {daySessions.slice(0, 3).map(s => (
                          <div
                            key={s.id}
                            className={`text-xs px-1.5 py-0.5 rounded truncate ${s.color[1]}`}
                          >
                            {format(s.startDate, 'h:mm a')} · {s.client_name}
                          </div>
                        ))}
                        {daySessions.length > 3 && (
                          <div className="text-xs text-gray-400 pl-1">
                            +{daySessions.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
    }
  }

  return <div className="h-full overflow-y-auto">{renderCalendar()}</div>
}

export default CalendarView
