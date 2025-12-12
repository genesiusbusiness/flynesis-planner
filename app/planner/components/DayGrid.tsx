'use client'

import { useState, useEffect } from 'react'
import { CalendarEvent } from '@/lib/types'
import { formatTime, getHours } from '@/lib/date'
import { cn } from '@/lib/utils'
import { getSettings } from '@/lib/storage'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addDays, subDays } from 'date-fns'

interface DayGridProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onTimeSlotClick: (date: Date, minutes: number) => void
  onDateChange: (date: Date) => void
  flyid: string
}

export function DayGrid({ currentDate, events, onEventClick, onTimeSlotClick, onDateChange, flyid }: DayGridProps) {
  const [settings, setSettings] = useState({ timeFormat: '24h' as '12h' | '24h' })

  useEffect(() => {
    async function loadSettings() {
      const loadedSettings = await getSettings(flyid)
      setSettings({ timeFormat: loadedSettings.timeFormat })
    }
    loadSettings()
  }, [flyid])
  const hours = getHours()
  const dateStr = currentDate.toISOString().split('T')[0]
  const dayEvents = events.filter((e) => e.dateISO === dateStr)

  const getEventPosition = (event: CalendarEvent) => {
    const top = (event.startMin / 60 - 6) * 60 // 6:00 = 0px
    const height = ((event.endMin - event.startMin) / 60) * 60
    return { top: `${top}px`, height: `${height}px` }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex">
        {/* Time column */}
        <div className="w-20 flex-shrink-0 border-r border-border/60">
          <div className="h-12 border-b border-border/60"></div>
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[60px] border-b border-border/40 text-xs text-muted-foreground px-2 py-1"
            >
              {formatTime(hour * 60, settings.timeFormat === '24h')}
            </div>
          ))}
        </div>

        {/* Single day column */}
        <div className="flex-1 relative">
          {/* Day header */}
          <div className="h-12 border-b border-border/60 bg-muted/30 flex items-center justify-between px-4 sticky top-0 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDateChange(subDays(currentDate, 1))}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <div className="text-sm font-semibold">
                {currentDate.toLocaleDateString('fr-FR', { weekday: 'long' })}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDateChange(addDays(currentDate, 1))}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Time slots */}
          <div className="relative" style={{ height: `${hours.length * 60}px` }}>
            {hours.map((hour) => (
              <div
                key={hour}
                    className="h-[60px] border-b border-border/30 cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onTimeSlotClick(currentDate, hour * 60)}
              />
            ))}

            {/* Events */}
            {dayEvents.map((event) => {
              const { top, height } = getEventPosition(event)
              return (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick(event)
                  }}
                  className={cn(
                    'absolute left-1 right-1 rounded-lg p-2 text-xs cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]',
                    'border-l-2'
                  )}
                      style={{
                        top,
                        height,
                        backgroundColor: `${event.color}30`,
                        borderLeftColor: event.color,
                        borderLeftWidth: '3px',
                        color: event.color,
                      }}
                >
                  <div className="font-semibold truncate">{event.title}</div>
                  <div className="text-[10px] opacity-80">
                    {formatTime(event.startMin, settings.timeFormat === '24h')} -{' '}
                    {formatTime(event.endMin, settings.timeFormat === '24h')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

