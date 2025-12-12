'use client'

import { useState, useEffect } from 'react'
import { CalendarEvent } from '@/lib/types'
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, format, startOfWeek, endOfWeek } from 'date-fns'
import { cn } from '@/lib/utils'
import { getSettings } from '@/lib/storage'

interface MonthGridProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onDayClick: (date: Date) => void
  flyid: string
}

export function MonthGrid({ currentDate, events, onEventClick, onDayClick, flyid }: MonthGridProps) {
  const [settings, setSettings] = useState({ weekStart: 'Mon' as 'Mon' | 'Sun' })

  useEffect(() => {
    async function loadSettings() {
      const loadedSettings = await getSettings(flyid)
      setSettings({ weekStart: loadedSettings.weekStart })
    }
    loadSettings()
  }, [flyid])
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: settings.weekStart === 'Mon' ? 1 : 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: settings.weekStart === 'Mon' ? 1 : 0 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter((e) => e.dateISO === dateStr)
  }

  const weekDays = settings.weekStart === 'Mon'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={index}
              onClick={() => onDayClick(day)}
              className={cn(
                'min-h-[100px] border border-border/60 rounded-xl p-2 cursor-pointer transition-all hover:bg-accent/60 bg-card/40',
                !isCurrentMonth && 'opacity-40',
                isToday && 'ring-2 ring-primary shadow-glow-violet bg-primary/10'
              )}
            >
              <div
                className={cn(
                  'text-sm font-medium mb-1',
                  isToday && 'text-primary'
                )}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className={cn(
                      'text-xs px-2 py-1 rounded truncate cursor-pointer transition-all hover:shadow-md',
                      'border-l-2'
                    )}
                    style={{
                      backgroundColor: `${event.color}35`,
                      borderLeftColor: event.color,
                      borderLeftWidth: '3px',
                    }}
                  >
                    {format(event.startMin / 60, 'HH:mm')} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{dayEvents.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

