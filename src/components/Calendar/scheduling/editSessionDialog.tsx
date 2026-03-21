import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sessionApi } from "@/lib/sessionApi"
import { useUser } from "@/context/UserContext"
import { addHours, format, isSameDay } from "date-fns"
import { CalendarIcon } from "lucide-react"

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? "00" : "30"
  const value = `${String(h).padStart(2, "0")}:${m}`
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const ampm = h < 12 ? "AM" : "PM"
  const label = `${hour12}:${m} ${ampm}`
  return { value, label }
})

interface DateTimePickerProps {
  label: string
  required?: boolean
  value: { date: Date | undefined; time: string }
  onChange: (v: { date: Date | undefined; time: string }) => void
}

function DateTimePicker({ label, required, value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minTime =
    value.date && isSameDay(value.date, new Date())
      ? format(addHours(new Date(), 1), "HH:mm")
      : undefined

  const availableSlots = minTime
    ? TIME_SLOTS.filter((slot) => slot.value >= minTime)
    : TIME_SLOTS

  const displayValue = value.date
    ? `${format(value.date, "MMM d, yyyy")}${value.time ? ` · ${TIME_SLOTS.find((s) => s.value === value.time)?.label ?? value.time}` : ""}`
    : null

  function handleDateSelect(d: Date | undefined) {
    const newVal = { date: d, time: value.time }
    if (d && isSameDay(d, new Date()) && minTime && value.time && value.time < minTime) {
      newVal.time = ""
    }
    onChange(newVal)
  }

  return (
    <div className="grid gap-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-between w-full border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ borderRadius: "24px", minHeight: "40px" }}
          >
            <span className={displayValue ? "text-foreground" : "text-muted-foreground"}>
              {displayValue ?? "Pick date & time"}
            </span>
            <CalendarIcon size={15} className="text-muted-foreground shrink-0 ml-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value.date}
            onSelect={handleDateSelect}
            disabled={{ before: today }}
            initialFocus
          />
          <div className="border-t border-border px-3 py-2">
            <Select
              value={value.time}
              onValueChange={(t) => onChange({ ...value, time: t })}
              disabled={!value.date}
            >
              <SelectTrigger className="w-full bg-white text-sm" style={{ borderRadius: "12px" }}>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent style={{ borderRadius: "12px", backgroundColor: "white" }}>
                <SelectGroup>
                  {availableSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ─── EditSessionDialog ────────────────────────────────────────────────────────

interface EditSessionDialogProps {
  sessionId: string | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditSessionDialog({
  sessionId,
  open,
  onClose,
  onSuccess,
}: EditSessionDialogProps) {
  const { userId } = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [clientName, setClientName] = useState("")
  const [sessionType, setSessionType] = useState("")
  const [startDT, setStartDT] = useState<{ date: Date | undefined; time: string }>({
    date: undefined,
    time: "",
  })
  const [endTime, setEndTime] = useState("")
  const [isPast, setIsPast] = useState(false)

  const endTimeSlots = startDT.time ? TIME_SLOTS.filter((s) => s.value > startDT.time) : []

  function handleStartDTChange(dt: { date: Date | undefined; time: string }) {
    setStartDT(dt)
    if (endTime && dt.time && endTime <= dt.time) setEndTime("")
  }

  useEffect(() => {
    if (!open || !sessionId) return
    setIsLoading(true)
    setError(null)
    setConfirmCancel(false)
    sessionApi
      .getSessionById(sessionId)
      .then((session: any) => {
        setClientName(session.client_name ?? "")
        setSessionType(session.session_type ?? "")
        const start = new Date(session.start_date)
        const end = new Date(session.end_date)
        setStartDT({ date: start, time: format(start, "HH:mm") })
        setEndTime(format(end, "HH:mm"))
        setIsPast(end < new Date())
      })
      .catch(() => setError("Failed to load session details."))
      .finally(() => setIsLoading(false))
  }, [open, sessionId])

  function buildISO(date: Date | undefined, time: string): string | null {
    if (!date) return null
    const [h = "00", m = "00"] = time.split(":")
    const d = new Date(date)
    d.setHours(Number(h), Number(m), 0, 0)
    return d.toISOString()
  }

  function handleClose() {
    setConfirmCancel(false)
    setError(null)
    onClose()
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!sessionId || !userId) return
    const startISO = buildISO(startDT.date, startDT.time)
    const endISO = buildISO(startDT.date, endTime)
    if (!sessionType || !startISO || !endISO) {
      setError("Please fill in all required fields.")
      return
    }
    try {
      setIsSubmitting(true)
      setError(null)

      // Conflict check — exclude current session
      const dayStart = new Date(startISO)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(startISO)
      dayEnd.setHours(23, 59, 59, 999)
      const existing = await sessionApi.getSessionByTimeRange(userId, {
        start_range: dayStart.toISOString(),
        end_range: dayEnd.toISOString(),
      })
      const proposedStart = new Date(startISO).getTime()
      const proposedEnd = new Date(endISO).getTime()
      const conflict = (existing ?? []).some((s: any) => {
        if (s.id === sessionId) return false
        const sStart = new Date(s.start_date).getTime()
        const sEnd = new Date(s.end_date).getTime()
        return sStart < proposedEnd && sEnd > proposedStart
      })
      if (conflict) {
        setError("This time slot conflicts with an existing session.")
        return
      }

      await sessionApi.updateSession(sessionId, {
        session_type: sessionType,
        start_time: startISO,
        end_time: endISO,
      })
      handleClose()
      onSuccess()
    } catch {
      setError("Failed to update session. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCancelSession() {
    if (!sessionId) return
    try {
      setIsCancelling(true)
      await sessionApi.cancelSession(sessionId)
      handleClose()
      onSuccess()
    } catch {
      setError("Failed to cancel session. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl">Edit Session</DialogTitle>
          {clientName && (
            <p className="text-sm text-muted-foreground">
              Session with{" "}
              <span className="font-medium text-foreground">{clientName}</span>
            </p>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 flex items-center justify-center text-sm text-muted-foreground">
            Loading session details…
          </div>
        ) : confirmCancel ? (
          <div className="py-4 grid gap-6">
            <p className="text-sm text-gray-700">
              Are you sure you want to cancel this session? This action cannot be undone.
            </p>
            {error && (
              <p className="text-sm text-destructive bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                style={{ borderRadius: "24px" }}
                onClick={() => setConfirmCancel(false)}
              >
                Go back
              </Button>
              <Button
                variant="outline"
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                style={{ borderRadius: "24px" }}
                disabled={isCancelling}
                onClick={handleCancelSession}
              >
                {isCancelling ? "Cancelling…" : "Yes, cancel session"}
              </Button>
            </DialogFooter>
          </div>
        ) : isPast ? (
          <div className="py-4 grid gap-4">
            <p className="text-sm text-muted-foreground bg-gray-50 px-3 py-2 rounded-lg">
              This session has already occurred and cannot be modified.
            </p>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Session Type</Label>
              <p className="text-sm px-3 py-2 border border-input rounded-full bg-white">{sessionType}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-semibold">Start</Label>
                <p className="text-sm px-3 py-2 border border-input rounded-full bg-white">
                  {startDT.date ? `${format(startDT.date, "MMM d, yyyy")} · ${TIME_SLOTS.find(s => s.value === startDT.time)?.label ?? startDT.time}` : "—"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-semibold">End Time</Label>
                <p className="text-sm px-3 py-2 border border-input rounded-full bg-white">
                  {TIME_SLOTS.find(s => s.value === endTime)?.label ?? endTime ?? "—"}
                </p>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" style={{ borderRadius: "24px" }} onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="grid gap-5 py-4">
              {/* Session Type */}
              <div className="grid gap-2">
                <Label className="text-sm font-semibold">
                  Session Type <span className="text-destructive">*</span>
                </Label>
                <Select value={sessionType} onValueChange={setSessionType}>
                  <SelectTrigger className="w-full bg-white" style={{ borderRadius: "24px" }}>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "16px", backgroundColor: "white" }}>
                    <SelectGroup>
                      <SelectItem value="Stretch">Stretch</SelectItem>
                      <SelectItem value="Personal Training">Personal Training</SelectItem>
                      <SelectItem value="Group Training">Group Training</SelectItem>
                      <SelectItem value="Neuromuscular Reconstruction">
                        Neuromuscular Reconstruction
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Start / End */}
              <div className="grid grid-cols-2 gap-4">
                <DateTimePicker
                  label="Start"
                  required
                  value={startDT}
                  onChange={handleStartDTChange}
                />
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">
                    End Time <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={endTime}
                    onValueChange={setEndTime}
                    disabled={!startDT.date || !startDT.time}
                  >
                    <SelectTrigger className="w-full bg-white" style={{ borderRadius: "24px" }}>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent style={{ borderRadius: "16px", backgroundColor: "white" }}>
                      <SelectGroup>
                        {endTimeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 mr-auto"
                style={{ borderRadius: "24px" }}
                onClick={() => setConfirmCancel(true)}
              >
                Cancel Session
              </Button>
              <Button
                type="button"
                variant="outline"
                style={{ borderRadius: "24px" }}
                onClick={handleClose}
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-50 hover:bg-green-100 border-green-200 text-green-800"
                variant="outline"
                style={{ borderRadius: "24px" }}
              >
                {isSubmitting ? "Saving…" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditSessionDialog
