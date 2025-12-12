# 🌐 Configuration du domaine planner.flynesis.com

## 📋 Configuration cible

- **Domaine**: `planner.flynesis.com`
- **Projet Vercel**: `flynesisplanner`
- **URL Vercel actuelle**: `https://flynesis-planner.vercel.app`

## 🚀 Étapes de configuration

### 1. Ajouter le domaine sur Vercel

1. Allez sur **Vercel Dashboard** → https://vercel.com/dashboard
2. Sélectionnez le projet **flynesisplanner**
3. Allez dans **Settings → Domains**
4. Cliquez sur **Add Domain**
5. Entrez: `planner.flynesis.com`
6. Cliquez sur **Add**

### 2. Configuration DNS (Cloudflare ou autre)

Vercel vous donnera les instructions exactes, mais voici la configuration standard :

#### Si vous utilisez Cloudflare :

1. Allez dans **Cloudflare Dashboard** → Sélectionnez le domaine `flynesis.com`
2. Allez dans **DNS → Records**
3. Ajoutez/modifiez un enregistrement **CNAME** :

```
Type: CNAME
Name: planner
Target: cname.vercel-dns.com
Proxy status: ✅ Proxied (orange cloud) - RECOMMANDÉ
TTL: Auto
```

**OU** si vous préférez DNS only (gris) :

```
Type: CNAME
Name: planner
Target: cname.vercel-dns.com
Proxy status: ⚪ DNS only (gris)
TTL: Auto
```

#### Si vous utilisez un autre hébergeur DNS :

1. Allez dans la section **DNS Management** de votre hébergeur
2. Ajoutez/modifiez un enregistrement **CNAME** :

```
Type: CNAME
Host/Name: planner
Value/Target: cname.vercel-dns.com
TTL: 3600 ou Auto
```

### 3. Vérification

Une fois les DNS configurés :

1. **Vercel vérifiera automatiquement** la configuration (peut prendre quelques minutes)
2. **Un certificat SSL sera généré automatiquement** (gratuit, HTTPS activé)
3. Le domaine sera **actif en quelques minutes** (jusqu'à 48h max pour la propagation DNS)

### 4. Test

Une fois configuré, testez :

```bash
# Vérifier les DNS
dig planner.flynesis.com CNAME
nslookup planner.flynesis.com

# Tester la connexion
curl -I https://planner.flynesis.com
```

## ✅ Checklist

- [ ] Domaine ajouté dans Vercel Dashboard
- [ ] CNAME configuré dans les DNS (planner → cname.vercel-dns.com)
- [ ] Statut "Valid" dans Vercel Dashboard → Domains
- [ ] Certificat SSL généré (automatique)
- [ ] Site accessible sur https://planner.flynesis.com
- [ ] Redirection HTTPS fonctionne (HTTP → HTTPS automatique)

## 🔍 Vérification dans Vercel

Après configuration, dans **Vercel Dashboard → Settings → Domains**, vous devriez voir :

```
planner.flynesis.com
Status: Valid
SSL: Valid (automatic)
```

## 🚨 Dépannage

### Le domaine ne fonctionne pas ?

1. **Vérifiez les DNS** : `dig planner.flynesis.com CNAME` doit retourner `cname.vercel-dns.com`
2. **Attendez la propagation** : Peut prendre jusqu'à 48h (généralement quelques minutes)
3. **Vérifiez dans Vercel** : Le statut doit être "Valid"
4. **Vérifiez le certificat SSL** : Il est généré automatiquement, attendez quelques minutes

### Erreur SSL ?

- Attendez 5-10 minutes après la configuration DNS
- Vérifiez que les DNS pointent correctement
- Contactez le support Vercel si le problème persiste après 24h

## 📝 Notes importantes

- ✅ **HTTPS automatique** : Vercel force HTTPS automatiquement
- ✅ **SSL gratuit** : Certificat Let's Encrypt généré automatiquement
- ✅ **Multiple domaines** : Vous pouvez ajouter d'autres domaines au même projet
- ⏱️ **Propagation DNS** : Généralement 5-30 minutes, maximum 48h

## 🔗 Liens utiles

- Vercel Domains: https://vercel.com/docs/concepts/projects/domains
- Vercel Dashboard: https://vercel.com/dashboard
- Votre projet: https://vercel.com/dashboard/flynesisplanner/settings/domains

