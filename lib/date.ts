import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, addDays, startOfDay, getDay } from 'date-fns'

export const formatTime = (minutes: number, format24h: boolean = false): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const h = format24h ? hours : hours % 12 || 12
  const ampm = format24h ? '' : hours >= 12 ? 'PM' : 'AM'
  return `${h}:${mins.toString().padStart(2, '0')} ${ampm}`.trim()
}

export const formatTimeForInput = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export const parseTime = (timeStr: string, format24h: boolean = false): number => {
  const [time, ampm] = timeStr.split(' ')
  const [hours, minutes] = time.split(':').map(Number)
  let h = hours
  if (!format24h && ampm) {
    if (ampm.toUpperCase() === 'PM' && hours !== 12) h += 12
    if (ampm.toUpperCase() === 'AM' && hours === 12) h = 0
  }
  return h * 60 + minutes
}

export const getWeekDays = (date: Date, weekStart: 'Mon' | 'Sun' = 'Mon'): Date[] => {
  const start = weekStart === 'Mon' 
    ? startOfWeek(date, { weekStartsOn: 1 })
    : startOfWeek(date, { weekStartsOn: 0 })
  const end = weekStart === 'Mon'
    ? endOfWeek(date, { weekStartsOn: 1 })
    : endOfWeek(date, { weekStartsOn: 0 })
  return eachDayOfInterval({ start, end })
}

export const isToday = (dateISO: string): boolean => {
  return isSameDay(parseISO(dateISO), new Date())
}

export const formatDate = (dateISO: string, formatStr: string = 'MMM d, yyyy'): string => {
  return format(parseISO(dateISO), formatStr)
}

export const getDateISO = (date: Date = new Date()): string => {
  return format(date, 'yyyy-MM-dd')
}

export const addDaysISO = (dateISO: string, days: number): string => {
  return getDateISO(addDays(parseISO(dateISO), days))
}

export const getHours = (): number[] => {
  return Array.from({ length: 18 }, (_, i) => i + 6) // 6:00 to 23:00
}

export const roundToNearest30 = (minutes: number): number => {
  return Math.round(minutes / 30) * 30
}

export const getTimeSlots = (format24h: boolean = false): string[] => {
  const slots: string[] = []
  for (let h = 6; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const totalMin = h * 60 + m
      slots.push(formatTime(totalMin, format24h))
    }
  }
  return slots
}

