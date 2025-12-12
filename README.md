# Flynesis Planner

Calendrier amélioré premium pour organiser votre planning avec style Flynesis.

## 🚀 Installation

```bash
npm install
```

## 🎯 Démarrage

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3006](http://localhost:3006)

## ✨ Fonctionnalités

- **Calendrier** : Vue Jour / Semaine / Mois avec drag & drop
- **Tâches** : Kanban avec 3 colonnes (Todo / Doing / Done)
- **Focus** : Timer Pomodoro intégré
- **Paramètres** : Export/Import JSON, préférences personnalisables

## 🎨 Design

- Style Flynesis premium : fond sombre élégant + glow violet/rose
- Responsive : mobile + desktop
- Animations fluides et transitions discrètes
- Glassmorphism et effets de blur

## ⌨️ Raccourcis clavier

- `Cmd/Ctrl + N` : Ouvrir le dialogue d'ajout (événement ou tâche selon l'onglet actif)

## 💾 Stockage

Toutes les données sont stockées dans Supabase (PostgreSQL) avec authentification FLYID.
- Connexion requise avec un compte Flynesis (FLYID)
- Création automatique du profil Planner à la première connexion
- Redirection vers `https://account.flynesis.com/signup` si pas de compte
- Données sécurisées avec Row Level Security (RLS)

## 📦 Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- @dnd-kit (drag & drop)
- Supabase (PostgreSQL + Auth FLYID)
- date-fns
- lucide-react (icônes)

## 🔐 Authentification

L'application utilise l'authentification Supabase avec FLYID :
- Vérification de la session au chargement
- Création automatique du profil Planner si première connexion
- Redirection vers `https://account.flynesis.com/signup` si pas de compte Flynesis

## 🗄️ Migration Supabase

Avant de lancer l'application, vous devez appliquer la migration SQL dans Supabase.
Voir `MIGRATION.md` pour les instructions détaillées.

