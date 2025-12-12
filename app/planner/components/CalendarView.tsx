'use client'

import { CalendarEvent, CalendarView as ViewType } from '@/lib/types'
import { WeekGrid } from './WeekGrid'
import { MonthGrid } from './MonthGrid'
import { DayGrid } from './DayGrid'

interface CalendarViewProps {
  view: ViewType
  currentDate: Date
  events: CalendarEvent[]
  onDateChange: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  onTimeSlotClick: (date: Date, minutes: number) => void
  onDayClick: (date: Date) => void
  flyid: string
}

export function CalendarView({
  view,
  currentDate,
  events,
  onDateChange,
  onEventClick,
  onTimeSlotClick,
  onDayClick,
  flyid,
}: CalendarViewProps) {
  if (view === 'Month') {
    return (
      <MonthGrid
        currentDate={currentDate}
        events={events}
        onEventClick={onEventClick}
        onDayClick={onDayClick}
        flyid={flyid}
      />
    )
  }

  if (view === 'Day') {
    return (
      <DayGrid
        currentDate={currentDate}
        events={events}
        onEventClick={onEventClick}
        onTimeSlotClick={onTimeSlotClick}
        onDateChange={onDateChange}
        flyid={flyid}
      />
    )
  }

  if (view === 'Week') {
    return (
      <WeekGrid
        currentDate={currentDate}
        events={events}
        onEventClick={onEventClick}
        onTimeSlotClick={onTimeSlotClick}
        flyid={flyid}
      />
    )
  }

  // Fallback to Week view
  return (
    <WeekGrid
      currentDate={currentDate}
      events={events}
      onEventClick={onEventClick}
      onTimeSlotClick={onTimeSlotClick}
      flyid={flyid}
    />
  )
}
