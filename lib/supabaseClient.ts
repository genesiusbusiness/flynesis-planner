import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Configuration Supabase - Variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window === 'undefined') {
    console.error('❌ Variables d\'environnement Supabase manquantes!')
    console.error('Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies')
  }
}

// Fonction pour obtenir le client singleton
function getSupabaseClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    const globalKey = '__flynesis_planner_supabase_client__'
    
    if ((window as any)[globalKey]) {
      return (window as any)[globalKey]
    }
    
    const client = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'flynesis-planner-auth',
        },
      }
    )
    
    ;(window as any)[globalKey] = client
    return client
  }
  
  return createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}

export const supabase = getSupabaseClient()

// Types pour les tables Supabase
export type PlannerProfile = {
  id: string
  flyid: string // UUID REFERENCES fly_accounts(id)
  created_at: string
  updated_at: string
}

export type PlannerEvent = {
  id: string
  flyid: string // UUID REFERENCES fly_accounts(id)
  title: string
  date_iso: string // DATE
  start_min: number // INTEGER (minutes depuis minuit)
  end_min: number // INTEGER
  type: 'Task' | 'Meeting' | 'Personal' | 'Music' | 'Flynesis' | 'Other'
  priority: 'Low' | 'Medium' | 'High'
  notes: string | null
  color: string // TEXT (hex color)
  created_at: string
  updated_at: string
}

export type PlannerTask = {
  id: string
  flyid: string // UUID REFERENCES fly_accounts(id)
  title: string
  status: 'Todo' | 'Doing' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
  tag: string | null
  due_iso: string | null // DATE
  created_at: string
  updated_at: string
}

export type PlannerSettings = {
  id: string
  flyid: string // UUID REFERENCES fly_accounts(id)
  week_start: 'Mon' | 'Sun'
  time_format: '12h' | '24h'
  default_view: 'Day' | 'Week' | 'Month'
  created_at: string
  updated_at: string
}

export type PlannerFocusSession = {
  id: string
  flyid: string // UUID REFERENCES fly_accounts(id)
  task_id: string | null // UUID REFERENCES planner_tasks(id)
  duration: number // INTEGER (minutes)
  completed_at: string
  created_at: string
}

