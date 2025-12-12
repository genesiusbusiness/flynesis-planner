'use client'

import { useState, useEffect } from 'react'
import { CalendarEvent, EventType, Priority } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getDateISO, formatTime, formatTimeForInput } from '@/lib/date'
import { getSettings } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: CalendarEvent
  defaultDate?: string
  onSave: (event: CalendarEvent) => void
  onDelete?: (id: string) => void
  flyid?: string
}

const EVENT_TYPES: EventType[] = ['Task', 'Meeting', 'Personal', 'Music', 'Flynesis', 'Other']
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']
const COLORS = ['#A472FF', '#FF7CEB', '#4BA8FF', '#10B981']

export function EventDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
  onSave,
  onDelete,
  flyid,
}: EventDialogProps) {
  const [settings, setSettings] = useState<{ timeFormat: '12h' | '24h' }>({ timeFormat: '24h' })

  useEffect(() => {
    async function loadSettings() {
      if (flyid) {
        const loadedSettings = await getSettings(flyid)
        setSettings({ timeFormat: loadedSettings.timeFormat })
      }
    }
    loadSettings()
  }, [flyid])
  const [title, setTitle] = useState('')
  const [dateISO, setDateISO] = useState(defaultDate || getDateISO())
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [type, setType] = useState<EventType>('Task')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [notes, setNotes] = useState('')
  const [color, setColor] = useState('#A472FF')

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDateISO(event.dateISO)
      setStartTime(formatTimeForInput(event.startMin))
      setEndTime(formatTimeForInput(event.endMin))
      setType(event.type)
      setPriority(event.priority)
      setNotes(event.notes || '')
      setColor(event.color)
    } else {
      setTitle('')
      setDateISO(defaultDate || getDateISO())
      setStartTime('09:00')
      setEndTime('10:00')
      setType('Task')
      setPriority('Medium')
      setNotes('')
      setColor('#A472FF')
    }
  }, [event, defaultDate])

  const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  const handleSave = () => {
    if (!title.trim()) return

    const startMin = parseTimeToMinutes(startTime)
    const endMin = parseTimeToMinutes(endTime)

    const eventData: CalendarEvent = {
      id: event?.id || `event-${Date.now()}`,
      title: title.trim(),
      dateISO,
      startMin,
      endMin,
      type,
      priority,
      notes: notes.trim() || undefined,
      color,
    }

    onSave(eventData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? 'Modifier l\'événement' : 'Nouvel événement'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nom de l'événement"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Début</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endTime">Fin</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as EventType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="color">Couleur</Label>
            <div className="flex gap-2 mt-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-10 h-10 rounded-lg border-2 transition-all',
                    color === c ? 'border-foreground scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes optionnelles..."
              className="mt-1 flex min-h-[80px] w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </div>
        </div>
        <DialogFooter>
          {event && onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(event.id)
                onOpenChange(false)
              }}
            >
              Supprimer
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

