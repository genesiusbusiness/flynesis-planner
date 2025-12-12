-- Migration: Création des tables pour Flynesis Planner
-- Date: 2025-12-12

-- Table: planner_profiles
-- Profil Planner pour chaque utilisateur FLYID
CREATE TABLE IF NOT EXISTS planner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flyid UUID NOT NULL REFERENCES fly_accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(flyid)
);

-- Table: planner_events
-- Événements du calendrier
CREATE TABLE IF NOT EXISTS planner_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flyid UUID NOT NULL REFERENCES fly_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date_iso DATE NOT NULL,
  start_min INTEGER NOT NULL CHECK (start_min >= 0 AND start_min < 1440),
  end_min INTEGER NOT NULL CHECK (end_min > start_min AND end_min <= 1440),
  type TEXT NOT NULL CHECK (type IN ('Task', 'Meeting', 'Personal', 'Music', 'Flynesis', 'Other')),
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  notes TEXT,
  color TEXT NOT NULL DEFAULT '#A472FF',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: planner_tasks
-- Tâches (Kanban)
CREATE TABLE IF NOT EXISTS planner_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flyid UUID NOT NULL REFERENCES fly_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Todo', 'Doing', 'Done')) DEFAULT 'Todo',
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  tag TEXT,
  due_iso DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: planner_settings
-- Paramètres utilisateur
CREATE TABLE IF NOT EXISTS planner_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flyid UUID NOT NULL REFERENCES fly_accounts(id) ON DELETE CASCADE,
  week_start TEXT NOT NULL CHECK (week_start IN ('Mon', 'Sun')) DEFAULT 'Mon',
  time_format TEXT NOT NULL CHECK (time_format IN ('12h', '24h')) DEFAULT '24h',
  default_view TEXT NOT NULL CHECK (default_view IN ('Day', 'Week', 'Month')) DEFAULT 'Week',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(flyid)
);

-- Table: planner_focus_sessions
-- Sessions de focus (Pomodoro)
CREATE TABLE IF NOT EXISTS planner_focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flyid UUID NOT NULL REFERENCES fly_accounts(id) ON DELETE CASCADE,
  task_id UUID REFERENCES planner_tasks(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_planner_events_flyid ON planner_events(flyid);
CREATE INDEX IF NOT EXISTS idx_planner_events_date ON planner_events(date_iso);
CREATE INDEX IF NOT EXISTS idx_planner_tasks_flyid ON planner_tasks(flyid);
CREATE INDEX IF NOT EXISTS idx_planner_tasks_status ON planner_tasks(status);
CREATE INDEX IF NOT EXISTS idx_planner_focus_sessions_flyid ON planner_focus_sessions(flyid);
CREATE INDEX IF NOT EXISTS idx_planner_focus_sessions_completed_at ON planner_focus_sessions(completed_at);

-- Row Level Security (RLS)
ALTER TABLE planner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_focus_sessions ENABLE ROW LEVEL SECURITY;

-- Policies RLS: Les utilisateurs ne peuvent voir/modifier QUE leurs propres données
-- Fonction helper pour obtenir le FLYID depuis auth.users
CREATE OR REPLACE FUNCTION get_flyid_from_auth()
RETURNS UUID AS $$
  SELECT id FROM fly_accounts WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies pour planner_profiles
CREATE POLICY "Users can view their own profile"
  ON planner_profiles FOR SELECT
  USING (flyid = get_flyid_from_auth());

CREATE POLICY "Users can insert their own profile"
  ON planner_profiles FOR INSERT
  WITH CHECK (flyid = get_flyid_from_auth());

CREATE POLICY "Users can update their own profile"
  ON planner_profiles FOR UPDATE
  USING (flyid = get_flyid_from_auth());

-- Policies pour planner_events
CREATE POLICY "Users can view their own events"
  ON planner_events FOR SELECT
  USING (flyid = get_flyid_from_auth());

CREATE POLICY "Users can insert their own events"
  ON planner_events FOR INSERT
  WITH CHECK (flyid = get_flyid_from_auth());

CREATE POLICY "Users can update their own events"
  ON planner_events FOR UPDATE
  USING (flyid = get_flyid_from_auth());

CREATE POLICY "Users can delete their own events"
  ON planner_events FOR DELETE
  USING (flyid = get_flyid_from_auth());

-- Policies pour planner_tasks
CREATE POLICY "Users can view their own tasks"
  ON planner_tasks FOR SELECT
  USING (flyid = get_flyid_from_auth());

CREATE POLICY "Users can insert their own tasks"
  ON planner_tasks FOR INSERT
  WITH CHECK (flyid = get_flyid_from_auth());

CREATE POLICY "Users can update their own tasks"
  ON planner_tasks FOR UPDATE
  USING (flyid = get_flyid_from_auth());

CREATE POLICY "Users can delete their own tasks"
  ON planner_tasks FOR DELETE
  USING (flyid = get_flyid_from_auth());

-- Policies pour planner_settings
CREATE POLICY "Users can view their own settings"
  ON planner_settings FOR SELECT
  USING (flyid = get_flyid_from_auth());

CREATE POLICY "Users can insert their own settings"
  ON planner_settings FOR INSERT
  WITH CHECK (flyid = get_flyid_from_auth());

CREATE POLICY "Users can update their own settings"
  ON planner_settings FOR UPDATE
  USING (flyid = get_flyid_from_auth());

-- Policies pour planner_focus_sessions
CREATE POLICY "Users can view their own focus sessions"
  ON planner_focus_sessions FOR SELECT
  USING (flyid = get_flyid_from_auth());

CREATE POLICY "Users can insert their own focus sessions"
  ON planner_focus_sessions FOR INSERT
  WITH CHECK (flyid = get_flyid_from_auth());

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_planner_profiles_updated_at
  BEFORE UPDATE ON planner_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planner_events_updated_at
  BEFORE UPDATE ON planner_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planner_tasks_updated_at
  BEFORE UPDATE ON planner_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planner_settings_updated_at
  BEFORE UPDATE ON planner_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

