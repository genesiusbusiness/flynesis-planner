'use client'

import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent, Task, CalendarView } from '@/lib/types'
import { PlannerShell } from './components/PlannerShell'
import { TopBar } from './components/TopBar'
import { CalendarView as CalendarViewComponent } from './components/CalendarView'
import { EventDialog } from './components/EventDialog'
import { TasksBoard } from './components/TasksBoard'
import { TaskDialog } from './components/TaskDialog'
import { FocusTimer } from './components/FocusTimer'
import { SettingsPanel } from './components/SettingsPanel'
import {
  getEvents,
  saveEvent,
  deleteEvent,
  getTasks,
  saveTask,
  deleteTask,
  getSettings,
  saveSettings,
} from '@/lib/storage'
import { checkAuthAndInitProfile } from '@/lib/auth'
import { getDateISO } from '@/lib/date'

export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [flyid, setFlyid] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('calendar')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('Week')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [eventDialogOpen, setEventDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>()
  const [selectedDate, setSelectedDate] = useState<string | undefined>()
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const authResult = await checkAuthAndInitProfile()
      
      if (!authResult.isAuthenticated || !authResult.flyid) {
        // Rediriger vers la page de login au lieu de signup
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return
      }

      setIsAuthenticated(true)
      setFlyid(authResult.flyid)

      // Charger les paramètres
      const settings = await getSettings(authResult.flyid)
      setView(settings.defaultView)

      // Charger les données
      const [loadedEvents, loadedTasks] = await Promise.all([
        getEvents(authResult.flyid),
        getTasks(authResult.flyid),
      ])

      setEvents(loadedEvents)
      setTasks(loadedTasks)
      setIsLoading(false)
    }

    init()
  }, [])

  // Keyboard shortcut: 'N' to open Add dialog
  useEffect(() => {
    if (!isAuthenticated) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (activeTab === 'calendar') {
          setSelectedEvent(undefined)
          setSelectedDate(undefined)
          setEventDialogOpen(true)
        } else if (activeTab === 'tasks') {
          setSelectedTask(undefined)
          setTaskDialogOpen(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [activeTab, isAuthenticated])

  const handleEventSave = useCallback(async (event: CalendarEvent) => {
    if (!flyid) return

    const savedEvent = await saveEvent(event, flyid)
    if (savedEvent) {
      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === event.id)
        return index >= 0
          ? [...prev.slice(0, index), savedEvent, ...prev.slice(index + 1)]
          : [...prev, savedEvent]
      })
    }
  }, [flyid])

  const handleEventDelete = useCallback(async (id: string) => {
    if (!flyid) return

    const success = await deleteEvent(id, flyid)
    if (success) {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    }
  }, [flyid])

  const handleTaskSave = useCallback(async (task: Task) => {
    if (!flyid) return

    const savedTask = await saveTask(task, flyid)
    if (savedTask) {
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === task.id)
        return index >= 0
          ? [...prev.slice(0, index), savedTask, ...prev.slice(index + 1)]
          : [...prev, savedTask]
      })
    }
  }, [flyid])

  const handleTaskUpdate = useCallback((task: Task) => {
    handleTaskSave(task)
  }, [handleTaskSave])

  const handleTaskDelete = useCallback(async (id: string) => {
    if (!flyid) return

    const success = await deleteTask(id, flyid)
    if (success) {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }, [flyid])

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setEventDialogOpen(true)
  }

  const handleTimeSlotClick = (date: Date, minutes: number) => {
    setSelectedDate(getDateISO(date))
    setSelectedEvent(undefined)
    setEventDialogOpen(true)
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(getDateISO(date))
    setSelectedEvent(undefined)
    setEventDialogOpen(true)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setTaskDialogOpen(true)
  }

  const handleAddClick = () => {
    if (activeTab === 'calendar') {
      setSelectedEvent(undefined)
      setSelectedDate(undefined)
      setEventDialogOpen(true)
    } else if (activeTab === 'tasks') {
      setSelectedTask(undefined)
      setTaskDialogOpen(true)
    }
  }

  const handleTodayClick = () => {
    setCurrentDate(new Date())
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0F0F1A] via-[#1A1525] to-[#151020]">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary">Flynesis Planner</div>
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !flyid) {
    return null // Redirection en cours
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <>
            <TopBar
              currentDate={currentDate}
              view={view}
              onViewChange={setView}
              onAddClick={handleAddClick}
              onTodayClick={handleTodayClick}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <CalendarViewComponent
              view={view}
              currentDate={currentDate}
              events={events.filter((e) =>
                searchQuery
                  ? e.title.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )}
              onDateChange={setCurrentDate}
              onEventClick={handleEventClick}
              onTimeSlotClick={handleTimeSlotClick}
              onDayClick={handleDayClick}
              flyid={flyid}
            />
          </>
        )
      case 'tasks':
        return (
          <TasksBoard
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onAddTask={handleAddClick}
            onTaskClick={handleTaskClick}
            searchQuery={searchQuery}
          />
        )
      case 'focus':
        return <FocusTimer tasks={tasks} flyid={flyid} />
      case 'settings':
        return <SettingsPanel flyid={flyid} />
      default:
        return null
    }
  }

  return (
    <PlannerShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        event={selectedEvent}
        defaultDate={selectedDate}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        flyid={flyid || undefined}
      />
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={selectedTask}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
      />
    </PlannerShell>
  )
}
