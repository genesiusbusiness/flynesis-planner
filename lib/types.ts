export type EventType = 'Task' | 'Meeting' | 'Personal' | 'Music' | 'Flynesis' | 'Other'
export type Priority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'Todo' | 'Doing' | 'Done'
export type CalendarView = 'Day' | 'Week' | 'Month'
export type WeekStart = 'Mon' | 'Sun'
export type TimeFormat = '12h' | '24h'

export interface CalendarEvent {
  id: string
  title: string
  dateISO: string // YYYY-MM-DD
  startMin: number // minutes depuis minuit (0-1439)
  endMin: number
  type: EventType
  priority: Priority
  notes?: string
  color: string // hex color
}

export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: Priority
  tag?: string
  dueISO?: string // YYYY-MM-DD
  createdAtISO: string
}

export interface Settings {
  weekStart: WeekStart
  timeFormat: TimeFormat
  defaultView: CalendarView
}

export interface FocusSession {
  id: string
  taskId?: string
  duration: number // minutes
  completedAtISO: string
}

export interface FocusData {
  sessions: FocusSession[]
  todayCount: number
}

