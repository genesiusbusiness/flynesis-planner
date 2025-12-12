# ⚙️ Configuration Vercel - Flynesis Planner

## 📋 Configuration actuelle

### Projet
- **Nom du projet**: `flynesisplanner`
- **URL Vercel**: `https://flynesis-planner.vercel.app`

### Domaine personnalisé (si configuré)
- **Type**: CNAME
- **Proxied**: Oui (Auto)
- **Status**: Actif

## ✅ Configuration recommandée

### 1. Variables d'environnement

Dans **Vercel Dashboard → Project Settings → Environment Variables**, vous pouvez ajouter (optionnel, car les clés sont déjà dans le code) :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

✅ **Note**: Les clés Supabase sont maintenant dans les variables d'environnement pour plus de sécurité.

### 2. Build Settings

Vercel détecte automatiquement Next.js, mais vérifiez dans **Settings → General** :

- **Framework Preset**: Next.js ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅
- **Node.js Version**: 18.x ou 20.x (recommandé)

### 3. Domaine personnalisé

Si vous souhaitez utiliser un domaine personnalisé (ex: `planner.flynesis.com`) :

1. Allez dans **Settings → Domains**
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions Vercel
4. Vercel générera automatiquement un certificat SSL

### 4. Redirections (si nécessaire)

Si vous voulez rediriger vers un domaine spécifique, ajoutez dans `vercel.json` :

```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/login",
      "permanent": false
    }
  ]
}
```

## 🔍 Vérification du déploiement

### Checklist

- [ ] Le build passe sans erreur
- [ ] L'application est accessible sur `https://flynesis-planner.vercel.app`
- [ ] La page de login s'affiche correctement
- [ ] L'authentification Supabase fonctionne
- [ ] Les migrations SQL sont appliquées dans Supabase
- [ ] Le domaine personnalisé (si configuré) fonctionne

### Logs et debugging

Pour voir les logs en cas de problème :
- **Vercel Dashboard → Deployments → [votre déploiement] → Logs**
- Ou via CLI : `vercel logs`

## 🚀 Déploiements automatiques

Avec l'intégration GitHub, Vercel déploie automatiquement :
- ✅ Chaque push sur `main` → Production
- ✅ Pull Requests → Preview deployments

## 📝 Notes importantes

1. **Supabase CORS** : Assurez-vous que votre domaine Vercel est autorisé dans les paramètres Supabase si nécessaire
2. **Variables d'environnement** : Si vous externalisez les clés Supabase, ajoutez-les dans Vercel
3. **Build time** : Le build prend généralement 1-2 minutes
4. **Cache** : Vercel met en cache automatiquement les builds

## 🔗 Liens utiles

- Dashboard Vercel: https://vercel.com/dashboard
- Documentation Vercel: https://vercel.com/docs
- Projet GitHub: https://github.com/genesiusbusiness/flynesis-planner

