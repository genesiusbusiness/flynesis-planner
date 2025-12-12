# 🚀 Déploiement sur Vercel

## ✅ Build réussi !

Le projet compile correctement et est prêt pour le déploiement.

## Option 1 : Via l'interface web Vercel (Recommandé - Plus simple)

1. **Allez sur [vercel.com](https://vercel.com)** et connectez-vous avec votre compte
2. **Cliquez sur "Add New Project"**
3. **Importez votre projet** :
   - Si votre code est sur GitHub/GitLab/Bitbucket : connectez le repository
   - Sinon : utilisez "Deploy" pour uploader le dossier directement
4. **Configuration automatique** :
   - Vercel détectera automatiquement Next.js
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (automatique)
   - Output Directory: `.next` (automatique)
5. **Cliquez sur "Deploy"**

## Option 2 : Via Vercel CLI

1. **Installez Vercel CLI** :
   ```bash
   npm install -g vercel
   ```

2. **Connectez-vous** (cela ouvrira votre navigateur) :
   ```bash
   cd "Sites/Flynesis Planner"
   vercel login
   ```

3. **Déployez** :
   ```bash
   vercel
   ```
   Répondez aux questions :
   - Set up and deploy? **Yes**
   - Which scope? (choisissez votre compte/équipe)
   - Link to existing project? **No** (première fois)
   - Project name? **flynesis-planner** (ou autre)
   - Directory? **./** (appuyez sur Entrée)
   - Override settings? **No**

4. **Déploiement en production** :
   ```bash
   vercel --prod
   ```

## Option 3 : Via Git (Déploiement automatique)

Si votre projet est sur GitHub/GitLab/Bitbucket :

1. **Connectez votre repository** à Vercel dans le dashboard
2. **Vercel déploiera automatiquement** :
   - À chaque push sur la branche principale → déploiement production
   - Sur les pull requests → preview deployments

## 📝 Notes importantes

- ✅ **Build vérifié** : Le projet compile sans erreur
- ✅ **Configuration** : `vercel.json` et `.vercelignore` sont créés
- ⚠️ **Supabase** : Les clés sont hardcodées dans le code (pas besoin de variables d'environnement pour l'instant)
- ⚠️ **Migration SQL** : Assurez-vous que la migration Supabase est appliquée avant le déploiement (voir `MIGRATION.md`)

## 🔗 Après le déploiement

Une fois déployé, vous obtiendrez une URL comme :
- `https://flynesis-planner.vercel.app` (ou votre nom de projet)

Vous pourrez ensuite :
- Configurer un domaine personnalisé
- Ajouter des variables d'environnement si nécessaire
- Voir les logs et analytics dans le dashboard Vercel
