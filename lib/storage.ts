'use client'

import { supabase } from './supabaseClient'
import type { PlannerEvent, PlannerTask, PlannerSettings, PlannerFocusSession } from './supabaseClient'
import { CalendarEvent, Task, Settings, FocusSession } from './types'

/**
 * Convertit un CalendarEvent en PlannerEvent pour Supabase
 */
function eventToSupabase(event: CalendarEvent, flyid: string): Omit<PlannerEvent, 'id' | 'created_at' | 'updated_at'> {
  return {
    flyid,
    title: event.title,
    date_iso: event.dateISO,
    start_min: event.startMin,
    end_min: event.endMin,
    type: event.type,
    priority: event.priority,
    notes: event.notes || null,
    color: event.color,
  }
}

/**
 * Convertit un PlannerEvent de Supabase en CalendarEvent
 */
function eventFromSupabase(event: PlannerEvent): CalendarEvent {
  return {
    id: event.id,
    title: event.title,
    dateISO: event.date_iso,
    startMin: event.start_min,
    endMin: event.end_min,
    type: event.type,
    priority: event.priority,
    notes: event.notes || undefined,
    color: event.color,
  }
}

/**
 * Convertit un Task en PlannerTask pour Supabase
 */
function taskToSupabase(task: Task, flyid: string): Omit<PlannerTask, 'id' | 'created_at' | 'updated_at'> {
  return {
    flyid,
    title: task.title,
    status: task.status,
    priority: task.priority,
    tag: task.tag || null,
    due_iso: task.dueISO || null,
  }
}

/**
 * Convertit un PlannerTask de Supabase en Task
 */
function taskFromSupabase(task: PlannerTask): Task {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    tag: task.tag || undefined,
    dueISO: task.due_iso || undefined,
    createdAtISO: task.created_at,
  }
}

/**
 * Obtient tous les événements pour un FLYID
 */
export async function getEvents(flyid: string): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase
      .from('planner_events')
      .select('*')
      .eq('flyid', flyid)
      .order('date_iso', { ascending: true })
      .order('start_min', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return (data || []).map(eventFromSupabase)
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

/**
 * Sauvegarde un événement
 */
export async function saveEvent(event: CalendarEvent, flyid: string): Promise<CalendarEvent | null> {
  try {
    if (event.id.startsWith('event-') || event.id.startsWith('sample-')) {
      // Nouvel événement
      const { data, error } = await supabase
        .from('planner_events')
        .insert(eventToSupabase(event, flyid))
        .select()
        .single()

      if (error) {
        console.error('Error saving event:', error)
        return null
      }

      return eventFromSupabase(data)
    } else {
      // Mise à jour
      const { data, error } = await supabase
        .from('planner_events')
        .update(eventToSupabase(event, flyid))
        .eq('id', event.id)
        .eq('flyid', flyid)
        .select()
        .single()

      if (error) {
        console.error('Error updating event:', error)
        return null
      }

      return eventFromSupabase(data)
    }
  } catch (error) {
    console.error('Error saving event:', error)
    return null
  }
}

/**
 * Supprime un événement
 */
export async function deleteEvent(eventId: string, flyid: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('planner_events')
      .delete()
      .eq('id', eventId)
      .eq('flyid', flyid)

    return !error
  } catch (error) {
    console.error('Error deleting event:', error)
    return false
  }
}

/**
 * Obtient toutes les tâches pour un FLYID
 */
export async function getTasks(flyid: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('planner_tasks')
      .select('*')
      .eq('flyid', flyid)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      return []
    }

    return (data || []).map(taskFromSupabase)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

/**
 * Sauvegarde une tâche
 */
export async function saveTask(task: Task, flyid: string): Promise<Task | null> {
  try {
    if (task.id.startsWith('task-') || task.id.startsWith('sample-')) {
      // Nouvelle tâche
      const { data, error } = await supabase
        .from('planner_tasks')
        .insert(taskToSupabase(task, flyid))
        .select()
        .single()

      if (error) {
        console.error('Error saving task:', error)
        return null
      }

      return taskFromSupabase(data)
    } else {
      // Mise à jour
      const { data, error } = await supabase
        .from('planner_tasks')
        .update(taskToSupabase(task, flyid))
        .eq('id', task.id)
        .eq('flyid', flyid)
        .select()
        .single()

      if (error) {
        console.error('Error updating task:', error)
        return null
      }

      return taskFromSupabase(data)
    }
  } catch (error) {
    console.error('Error saving task:', error)
    return null
  }
}

/**
 * Supprime une tâche
 */
export async function deleteTask(taskId: string, flyid: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('planner_tasks')
      .delete()
      .eq('id', taskId)
      .eq('flyid', flyid)

    return !error
  } catch (error) {
    console.error('Error deleting task:', error)
    return false
  }
}

/**
 * Obtient les paramètres pour un FLYID
 */
export async function getSettings(flyid: string): Promise<Settings> {
  try {
    const { data, error } = await supabase
      .from('planner_settings')
      .select('*')
      .eq('flyid', flyid)
      .single()

    if (error || !data) {
      // Retourner les valeurs par défaut
      return {
        weekStart: 'Mon',
        timeFormat: '24h',
        defaultView: 'Week',
      }
    }

    return {
      weekStart: data.week_start as 'Mon' | 'Sun',
      timeFormat: data.time_format as '12h' | '24h',
      defaultView: data.default_view as 'Day' | 'Week' | 'Month',
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return {
      weekStart: 'Mon',
      timeFormat: '24h',
      defaultView: 'Week',
    }
  }
}

/**
 * Sauvegarde les paramètres
 */
export async function saveSettings(settings: Settings, flyid: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('planner_settings')
      .upsert({
        flyid,
        week_start: settings.weekStart,
        time_format: settings.timeFormat,
        default_view: settings.defaultView,
      })

    return !error
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

/**
 * Obtient les sessions de focus pour un FLYID
 */
export async function getFocusSessions(flyid: string): Promise<FocusSession[]> {
  try {
    const { data, error } = await supabase
      .from('planner_focus_sessions')
      .select('*')
      .eq('flyid', flyid)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching focus sessions:', error)
      return []
    }

    return (data || []).map((s: PlannerFocusSession) => ({
      id: s.id,
      taskId: s.task_id || undefined,
      duration: s.duration,
      completedAtISO: s.completed_at,
    }))
  } catch (error) {
    console.error('Error fetching focus sessions:', error)
    return []
  }
}

/**
 * Sauvegarde une session de focus
 */
export async function saveFocusSession(session: FocusSession, flyid: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('planner_focus_sessions')
      .insert({
        flyid,
        task_id: session.taskId || null,
        duration: session.duration,
        completed_at: session.completedAtISO,
      })

    return !error
  } catch (error) {
    console.error('Error saving focus session:', error)
    return false
  }
}

/**
 * Export des données (pour backup)
 */
export async function exportData(flyid: string): Promise<string> {
  try {
    const [events, tasks, settings, sessions] = await Promise.all([
      getEvents(flyid),
      getTasks(flyid),
      getSettings(flyid),
      getFocusSessions(flyid),
    ])

    return JSON.stringify({
      events,
      tasks,
      settings,
      focus: { sessions },
      exportedAt: new Date().toISOString(),
    }, null, 2)
  } catch (error) {
    console.error('Error exporting data:', error)
    return '{}'
  }
}

/**
 * Import des données (pour restore)
 */
export async function importData(jsonString: string, flyid: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString)
    
    // Supprimer toutes les données existantes
    await Promise.all([
      supabase.from('planner_events').delete().eq('flyid', flyid),
      supabase.from('planner_tasks').delete().eq('flyid', flyid),
      supabase.from('planner_focus_sessions').delete().eq('flyid', flyid),
    ])

    // Importer les nouvelles données
    if (data.events && Array.isArray(data.events)) {
      for (const event of data.events) {
        await saveEvent(event, flyid)
      }
    }

    if (data.tasks && Array.isArray(data.tasks)) {
      for (const task of data.tasks) {
        await saveTask(task, flyid)
      }
    }

    if (data.settings) {
      await saveSettings(data.settings, flyid)
    }

    if (data.focus?.sessions && Array.isArray(data.focus.sessions)) {
      for (const session of data.focus.sessions) {
        await saveFocusSession(session, flyid)
      }
    }

    return true
  } catch (error) {
    console.error('Error importing data:', error)
    return false
  }
}

/**
 * Réinitialise toutes les données
 */
export async function resetData(flyid: string): Promise<boolean> {
  try {
    await Promise.all([
      supabase.from('planner_events').delete().eq('flyid', flyid),
      supabase.from('planner_tasks').delete().eq('flyid', flyid),
      supabase.from('planner_focus_sessions').delete().eq('flyid', flyid),
    ])

    return true
  } catch (error) {
    console.error('Error resetting data:', error)
    return false
  }
}
