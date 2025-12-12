'use client'

import { supabase } from './supabaseClient'
import type { PlannerProfile } from './supabaseClient'

/**
 * Obtient le FLYID de l'utilisateur actuel depuis fly_accounts
 */
export async function getCurrentFlyId(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const { data, error } = await supabase
      .from('fly_accounts')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single()

    if (error || !data) return null
    return data.id
  } catch {
    return null
  }
}

/**
 * Vérifie si l'utilisateur a un profil Planner
 */
export async function hasPlannerProfile(flyid: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('planner_profiles')
      .select('id')
      .eq('flyid', flyid)
      .single()

    return !error && !!data
  } catch {
    return false
  }
}

/**
 * Crée ou récupère un profil Planner pour l'utilisateur
 * Gère les doublons en vérifiant d'abord l'existence
 */
export async function createPlannerProfile(flyid: string): Promise<PlannerProfile | null> {
  try {
    // Vérifier d'abord si le profil existe déjà
    const { data: existing, error: checkError } = await supabase
      .from('planner_profiles')
      .select('*')
      .eq('flyid', flyid)
      .maybeSingle()

    // Si le profil existe déjà, retourner le profil existant
    if (existing && !checkError) {
      await ensureDefaultSettings(flyid)
      return existing
    }

    // Créer le nouveau profil
    const { data, error } = await supabase
      .from('planner_profiles')
      .insert({
        flyid,
      })
      .select()
      .single()

    if (error) {
      // Si erreur de contrainte unique (race condition), récupérer le profil existant
      if (error.code === '23505') {
        const { data: existingProfile } = await supabase
          .from('planner_profiles')
          .select('*')
          .eq('flyid', flyid)
          .single()
        if (existingProfile) {
          await ensureDefaultSettings(flyid)
          return existingProfile
        }
      }
      console.error('Error creating planner profile:', error)
      return null
    }

    // Créer aussi les settings par défaut
    await ensureDefaultSettings(flyid)

    return data
  } catch (error) {
    console.error('Error creating planner profile:', error)
    return null
  }
}

/**
 * S'assure que les settings par défaut existent pour un FLYID
 */
async function ensureDefaultSettings(flyid: string): Promise<void> {
  try {
    const { data: existingSettings } = await supabase
      .from('planner_settings')
      .select('*')
      .eq('flyid', flyid)
      .single()

    if (!existingSettings) {
      await supabase
        .from('planner_settings')
        .insert({
          flyid,
          week_start: 'Mon',
          time_format: '24h',
          default_view: 'Week',
        })
    }
  } catch (error) {
    console.error('Error ensuring default settings:', error)
  }
}

/**
 * Vérifie la session et initialise le profil si nécessaire
 */
export async function checkAuthAndInitProfile(): Promise<{
  isAuthenticated: boolean
  flyid: string | null
  hasProfile: boolean
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return {
        isAuthenticated: false,
        flyid: null,
        hasProfile: false,
      }
    }

    const flyid = await getCurrentFlyId()
    if (!flyid) {
      return {
        isAuthenticated: false,
        flyid: null,
        hasProfile: false,
      }
    }

    // Créer ou récupérer le profil (gère les doublons)
    const profile = await createPlannerProfile(flyid)
    
    return {
      isAuthenticated: true,
      flyid,
      hasProfile: !!profile,
    }
  } catch (error) {
    console.error('Error checking auth:', error)
    return {
      isAuthenticated: false,
      flyid: null,
      hasProfile: false,
    }
  }
}

/**
 * Redirige vers la page de connexion
 */
export function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

/**
 * Redirige vers la page de création de compte
 */
export function redirectToSignup() {
  if (typeof window !== 'undefined') {
    window.location.href = 'https://account.flynesis.com/signup'
  }
}

