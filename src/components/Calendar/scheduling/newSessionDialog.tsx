import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { clientApi } from "@/lib/clientApi"
import { sessionApi } from "@/lib/sessionApi"
import { useUser } from "@/context/UserContext"
import { format, isSameDay, addHours } from "date-fns"
import { CalendarIcon, Check, ChevronDown, Plus, X } from "lucide-react"
import React, { useEffect, useState } from "react"

const TOOLS_USED = [
  "Heated scraper",
  "Scraping tool kit",
  "Cupping",
  "PNF stretching",
  "Trigger point/Massage therapy",
  "Hyper volt",
  "Tens unit",
  "Norma tech",
]

interface Client {
  id: string
  client_name: string
  client_email: string
}

// ─── DateTimePicker ───────────────────────────────────────────────────────────

interface DateTimePickerProps {
  label: string
  required?: boolean
  value: { date: Date | undefined; time: string }
  onChange: (v: { date: Date | undefined; time: string }) => void
}

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? "00" : "30"
  const value = `${String(h).padStart(2, "0")}:${m}`
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const ampm = h < 12 ? "AM" : "PM"
  const label = `${hour12}:${m} ${ampm}`
  return { value, label }
})

function DateTimePicker({ label, required, value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minTime = value.date && isSameDay(value.date, new Date())
    ? format(addHours(new Date(), 1), "HH:mm")
    : undefined

  const availableSlots = minTime
    ? TIME_SLOTS.filter(slot => slot.value >= minTime)
    : TIME_SLOTS

  const displayValue = value.date
    ? `${format(value.date, "MMM d, yyyy")}${value.time ? ` · ${TIME_SLOTS.find(s => s.value === value.time)?.label ?? value.time}` : ""}`
    : null

  function handleDateSelect(d: Date | undefined) {
    const newVal = { date: d, time: value.time }
    // clear time if it's no longer valid for the newly selected date
    if (d && isSameDay(d, new Date()) && minTime && value.time && value.time < minTime) {
      newVal.time = ""
    }
    onChange(newVal)
  }

  return (
    <div className="grid gap-2">
      <Label>
        {label}{" "}
        {required && <span className="text-destructive">*</span>}
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
                  {availableSlots.map(slot => (
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

// ─── NewSession ───────────────────────────────────────────────────────────────

const EMPTY_FORM = { sessionType: "", description: "" }
const EMPTY_DT = { date: undefined as Date | undefined, time: "" }

export function NewSession({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { userId } = useUser()

  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false)

  const [toolsUsed, setToolsUsed] = useState<string[]>([])
  const [toolsPopoverOpen, setToolsPopoverOpen] = useState(false)

  const [form, setForm] = useState(EMPTY_FORM)
  const [startDT, setStartDT] = useState(EMPTY_DT)
  const [endTime, setEndTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endTimeSlots = startDT.time
    ? TIME_SLOTS.filter(slot => slot.value > startDT.time)
    : []

  function handleStartDTChange(dt: typeof EMPTY_DT) {
    setStartDT(dt)
    if (endTime && dt.time && endTime <= dt.time) setEndTime("")
  }

  useEffect(() => {
    if (!userId) return
    clientApi.getClientsByTrainerId(userId)
      .then((all: (Client & { isActive?: boolean })[]) => setClients(all.filter(c => c.isActive !== false)))
      .catch(console.error)
  }, [userId])

  function toggleTool(tool: string) {
    setToolsUsed(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool])
  }

  function handleReset() {
    setSelectedClient(null)
    setToolsUsed([])
    setForm(EMPTY_FORM)
    setStartDT(EMPTY_DT)
    setEndTime("")
    setError(null)
  }

  function buildISO(dt: typeof EMPTY_DT): string | null {
    if (!dt.date) return null
    const [h = "00", m = "00"] = dt.time.split(":")
    const d = new Date(dt.date)
    d.setHours(Number(h), Number(m), 0, 0)
    return d.toISOString()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const startISO = buildISO(startDT)
    const endISO = buildISO({ date: startDT.date, time: endTime })
    if (!selectedClient || !form.sessionType || !startISO || !endISO) {
      setError("Please fill in all required fields.")
      return
    }
    if (!userId) return
    try {
      setIsSubmitting(true)
      setError(null)

      // Conflict check — fetch all sessions for the trainer on that day
      const dayStart = new Date(startISO); dayStart.setHours(0, 0, 0, 0)
      const dayEnd   = new Date(startISO); dayEnd.setHours(23, 59, 59, 999)
      const existing = await sessionApi.getSessionByTimeRange(userId, {
        start_range: dayStart.toISOString(),
        end_range: dayEnd.toISOString(),
      })
      const proposedStart = new Date(startISO).getTime()
      const proposedEnd   = new Date(endISO).getTime()
      const conflict = (existing ?? []).some((s: any) => {
        const s_start = new Date(s.start_date).getTime()
        const s_end   = new Date(s.end_date).getTime()
        return s_start < proposedEnd && s_end > proposedStart
      })
      if (conflict) {
        setError("This time slot conflicts with an existing session.")
        return
      }

      await sessionApi.createSession({
        client_id: selectedClient.id,
        trainer_id: userId,
        client_name: selectedClient.client_name,
        client_email: selectedClient.client_email,
        session_type: form.sessionType,
        start_time: startISO,
        end_time: endISO,
        ...(form.description.trim() && { description: form.description }),
        ...(toolsUsed.length > 0 && { tools_used: toolsUsed }),
      })
      setOpen(false)
      handleReset()
      onSuccess?.()
    } catch {
      setError("Failed to create session. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => { setOpen(o); if (!o) handleReset() }}>
      <DialogTrigger asChild>
        <Button
          variant="blue"
          size="sm"
          className="flex items-center"
          style={{ borderRadius: "9999px" }}
        >
          <Plus size={16} className="mr-1" />
          New Session
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-1">
            <DialogTitle className="text-xl">Schedule New Session</DialogTitle>
            <p className="text-sm text-muted-foreground">Fill in the details below to book a session.</p>
          </DialogHeader>

          <div className="grid gap-5 py-4">

            {/* ── Client ── */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">
                Client <span className="text-destructive">*</span>
              </Label>
              <Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full border border-input bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors hover:bg-gray-50"
                    style={{ borderRadius: "24px" }}
                  >
                    <span className={selectedClient ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {selectedClient ? selectedClient.client_name : "Select a client"}
                    </span>
                    <ChevronDown size={16} className="text-muted-foreground shrink-0 ml-2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                  <div className="overflow-auto max-h-48" style={{ borderRadius: "16px" }}>
                    {clients.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground">No clients found</div>
                    ) : (
                      clients.map(client => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => { setSelectedClient(client); setClientPopoverOpen(false) }}
                          className="flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors"
                        >
                          <div>
                            <div className="font-medium text-foreground">{client.client_name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{client.client_email}</div>
                          </div>
                          {selectedClient?.id === client.id && (
                            <Check size={14} className="text-primary shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* ── Session Type ── */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">
                Session Type <span className="text-destructive">*</span>
              </Label>
              <Select value={form.sessionType} onValueChange={(v: string) => setForm(f => ({ ...f, sessionType: v }))}>
                <SelectTrigger className="w-full bg-white" style={{ borderRadius: "24px" }}>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent style={{ borderRadius: "16px", backgroundColor: "white" }}>
                  <SelectGroup>
                    <SelectItem value="Stretch">Stretch</SelectItem>
                    <SelectItem value="Personal Training">Personal Training</SelectItem>
                    <SelectItem value="Group Training">Group Training</SelectItem>
                    <SelectItem value="Neuromuscular Reconstruction">Neuromuscular Reconstruction</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* ── Start / End ── */}
            <div className="grid grid-cols-2 gap-4">
              <DateTimePicker label="Start" required value={startDT} onChange={handleStartDTChange} />
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
                      {endTimeSlots.map(slot => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Description ── */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">
                Description{" "}
                <span className="text-xs text-muted-foreground font-normal">(optional)</span>
              </Label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Session notes or focus areas..."
                className="flex w-full border border-input bg-white px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                style={{ borderRadius: "16px" }}
              />
            </div>

            {/* ── Tools Used ── */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">
                Tools Used{" "}
                <span className="text-xs text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Popover open={toolsPopoverOpen} onOpenChange={setToolsPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full border border-input bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors hover:bg-gray-50"
                    style={{ borderRadius: "24px" }}
                  >
                    <span className="text-muted-foreground">
                      {toolsUsed.length === 0
                        ? "Select tools"
                        : `${toolsUsed.length} tool${toolsUsed.length > 1 ? "s" : ""} selected`}
                    </span>
                    <ChevronDown size={16} className="text-muted-foreground shrink-0 ml-2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                  <div className="overflow-auto max-h-48" style={{ borderRadius: "16px" }}>
                    {TOOLS_USED.map(tool => {
                      const checked = toolsUsed.includes(tool)
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleTool(tool)}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors"
                        >
                          <div
                            className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                              checked ? "bg-primary border-primary" : "border-input"
                            }`}
                          >
                            {checked && <Check size={10} className="text-primary-foreground" />}
                          </div>
                          {tool}
                        </button>
                      )
                    })}
                  </div>
                </PopoverContent>
              </Popover>

              {toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {toolsUsed.map(tool => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 font-medium"
                      style={{ borderRadius: "9999px" }}
                    >
                      {tool}
                      <button type="button" onClick={() => toggleTool(tool)} className="hover:text-destructive">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
          </div>

          <DialogFooter className="pt-2 gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                style={{ borderRadius: "24px" }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-800"
              variant="outline"
              style={{ borderRadius: "24px" }}
            >
              {isSubmitting ? "Creating..." : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewSession
