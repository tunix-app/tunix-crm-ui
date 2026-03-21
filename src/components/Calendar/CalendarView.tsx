import { useMemo, useRef, useCallback } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

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
  onSessionClick?: (sessionId: string) => void
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-US': enUS },
})

const SESSION_STYLE: Record<string, { background: string; border: string; color: string }> = {
  'Stretch':                      { background: '#dcfce7', border: '#16a34a', color: '#052e16' },
  'Personal Training':            { background: '#dbeafe', border: '#2563eb', color: '#1e1b4b' },
  'Group Training':               { background: '#ede9fe', border: '#7c3aed', color: '#2e1065' },
  'Neuromuscular Reconstruction': { background: '#fef3c7', border: '#f59e0b', color: '#451a03' },
}
const FALLBACK_STYLE = { background: '#f3f4f6', border: '#6b7280', color: '#111827' }

interface RBCEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Session
}

const CalendarView = ({ currentDate, view, sessions = [], onSessionClick }: CalendarViewProps) => {
  const cbRef = useRef(onSessionClick)
  cbRef.current = onSessionClick

  const events: RBCEvent[] = useMemo(() => {
    return sessions.flatMap(s => {
      const start = new Date(s.start_date)
      const end = new Date(s.end_date)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return []
      return [{ id: s.id, title: `${s.session_type} · ${s.client_name}`, start, end, resource: s }]
    })
  }, [sessions])

  const slotPropGetter = useCallback((slotDate: Date) => {
    if (slotDate < new Date()) {
      return { style: { backgroundColor: '#f3f4f6' } }
    }
    return {}
  }, [])

  const dayPropGetter = useCallback((date: Date) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    if (date < today) {
      return { style: { backgroundColor: '#f9fafb' } }
    }
    return {}
  }, [])

  // Stable component — cbRef is always fresh so no deps needed
  const EventComponent = useMemo(() =>
    ({ event }: { event: RBCEvent }) => {
      const style = SESSION_STYLE[event.resource.session_type] ?? FALLBACK_STYLE
      return (
        <div
          onClick={(e) => { e.stopPropagation(); cbRef.current?.(event.id) }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: style.background,
            borderLeft: `3px solid ${style.border}`,
            color: style.color,
            borderRadius: '4px',
            padding: '2px 4px',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {event.resource.session_type}
          </div>
          <div style={{ fontSize: '0.65rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', opacity: 0.8 }}>
            {event.resource.client_name}
          </div>
        </div>
      )
    },
  []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full rbc-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        date={currentDate}
        view={view}
        onNavigate={() => {}}
        onView={() => {}}
        components={{ event: EventComponent }}
        slotPropGetter={slotPropGetter}
        dayPropGetter={dayPropGetter}
        style={{ height: '100%' }}
        min={new Date(0, 0, 0, 6, 0)}
        max={new Date(0, 0, 0, 22, 0)}
        formats={{
          timeGutterFormat: (date: Date) => format(date, 'h a'),
          eventTimeRangeFormat: () => '',
        }}
        popup
      />
    </div>
  )
}

export default CalendarView
