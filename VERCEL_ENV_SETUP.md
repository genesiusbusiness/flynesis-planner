# ⚙️ Configuration Variables d'Environnement Vercel

## 🔐 Variables à configurer sur Vercel

Allez dans **Vercel Dashboard → flynesisplanner → Settings → Environment Variables** et ajoutez :

### 1. NEXT_PUBLIC_SUPABASE_URL
- **Valeur**: `https://yxkbvhymsvasknslhpsa.supabase.co`
- **Environnements**: ✅ Production, ✅ Preview, ✅ Development

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Valeur**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4a2J2aHltc3Zhc2tuc2xocHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzI1MjQsImV4cCI6MjA3NzI0ODUyNH0.zbE1YiXZXDEgpLkRS9XDU8yt4n4EiQItU_YSoEQveTM`
- **Environnements**: ✅ Production, ✅ Preview, ✅ Development

## 📝 Étapes

1. Ouvrez https://vercel.com/dashboard
2. Sélectionnez le projet **flynesisplanner**
3. Allez dans **Settings → Environment Variables**
4. Cliquez sur **Add New**
5. Ajoutez chaque variable (copiez-collez les valeurs ci-dessus)
6. Cochez **Production**, **Preview**, et **Development** pour chaque variable
7. Cliquez sur **Save**
8. **Redéployez** le projet (Deployments → ... → Redeploy)

## ✅ Vérification

Après le redéploiement, vérifiez que :
- ✅ L'application se charge correctement
- ✅ La page de login s'affiche
- ✅ L'authentification fonctionne

## 🔒 Sécurité

- ✅ Les clés ne sont plus dans le code source
- ✅ Les variables sont sécurisées dans Vercel
- ✅ Le fichier `.env.local` est ignoré par git

