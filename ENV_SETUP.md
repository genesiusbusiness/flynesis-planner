# 🔐 Configuration des Variables d'Environnement

## ✅ Modifications effectuées

1. **Clés Supabase retirées du code** → Utilisation de variables d'environnement
2. **Fichier `.env.example` créé** → Template pour les variables
3. **`.gitignore` mis à jour** → Les fichiers `.env*` ne sont plus trackés
4. **Secrets GitHub configurés** → Pour les déploiements automatiques

## 📋 Variables d'environnement nécessaires

### Pour le développement local

Créez un fichier `.env.local` dans la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://yxkbvhymsvasknslhpsa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

### Pour Vercel (Production)

Les variables doivent être configurées dans **Vercel Dashboard** :

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez le projet `flynesisplanner`
3. Allez dans **Settings → Environment Variables**
4. Ajoutez les variables suivantes :

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yxkbvhymsvasknslhpsa.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

⚠️ **Important** : 
- Cochez **Production**, **Preview**, et **Development** pour chaque variable
- Après avoir ajouté les variables, **redéployez** le projet

## 🔒 Sécurité

### ✅ Ce qui est sécurisé maintenant

- ✅ Clés Supabase retirées du code source
- ✅ `.env.local` dans `.gitignore` (ne sera jamais commité)
- ✅ Secrets GitHub configurés pour CI/CD
- ✅ Variables d'environnement pour Vercel

### ⚠️ À faire manuellement

1. **Configurer les variables sur Vercel** (voir ci-dessus)
2. **Redéployer** après avoir ajouté les variables
3. **Vérifier** que l'application fonctionne après le redéploiement

## 🚀 Commandes utiles

### Vérifier les variables locales
```bash
# Vérifier que .env.local existe
cat .env.local
```

### Tester le build local
```bash
npm run build
```

### Redéployer sur Vercel
```bash
vercel --prod
```

## 📝 Notes

- Les variables `NEXT_PUBLIC_*` sont accessibles côté client (nécessaire pour Supabase)
- Ne jamais commiter de fichiers `.env*` contenant des vraies clés
- Le fichier `.env.example` sert de template sans valeurs réelles

