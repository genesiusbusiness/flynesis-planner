# Migration Supabase - Flynesis Planner

## 📋 Étapes pour migrer vers Supabase

### 1. Appliquer la migration SQL

Connectez-vous à votre projet Supabase et exécutez le fichier de migration :

```sql
-- Fichier: lib/supabase/migrations/001_create_planner_tables.sql
```

**Via l'interface Supabase :**
1. Allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `lib/supabase/migrations/001_create_planner_tables.sql`
4. Exécutez la requête

**Via Supabase CLI :**
```bash
supabase migration up
```

### 2. Vérifier les tables créées

Les tables suivantes doivent être créées :
- `planner_profiles` - Profils utilisateurs
- `planner_events` - Événements du calendrier
- `planner_tasks` - Tâches (Kanban)
- `planner_settings` - Paramètres utilisateur
- `planner_focus_sessions` - Sessions de focus (Pomodoro)

### 3. Vérifier les Row Level Security (RLS)

Toutes les tables doivent avoir RLS activé avec les policies appropriées :
- Les utilisateurs ne peuvent voir/modifier QUE leurs propres données (filtrées par FLYID)

### 4. Tester l'authentification

1. Connectez-vous avec un compte Flynesis (FLYID)
2. À la première connexion, un profil Planner est créé automatiquement
3. Si pas de compte, redirection vers `https://account.flynesis.com/signup`

## 🔐 Authentification FLYID

L'app utilise l'authentification Supabase avec FLYID :
- Vérifie la session Supabase
- Récupère le FLYID depuis `fly_accounts` via `auth_user_id`
- Crée automatiquement un profil Planner si première connexion
- Redirige vers signup si pas de compte

## 📊 Structure des données

Toutes les données sont liées au FLYID :
- `planner_events.flyid` → `fly_accounts.id`
- `planner_tasks.flyid` → `fly_accounts.id`
- `planner_settings.flyid` → `fly_accounts.id`
- `planner_focus_sessions.flyid` → `fly_accounts.id`

## ✅ Vérifications post-migration

- [ ] Tables créées avec succès
- [ ] RLS activé sur toutes les tables
- [ ] Policies RLS fonctionnent correctement
- [ ] Authentification FLYID fonctionne
- [ ] Création automatique du profil à la première connexion
- [ ] Redirection vers signup si pas de compte

