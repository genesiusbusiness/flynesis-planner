'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  // Vérifier si déjà connecté
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // Vérifier si l'utilisateur a un FLYID
          const { data } = await supabase
            .from('fly_accounts')
            .select('id')
            .eq('auth_user_id', session.user.id)
            .single()

          if (data) {
            router.push('/planner')
            return
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message || 'Erreur de connexion')
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError('Erreur de connexion')
        setIsLoading(false)
        return
      }

      // Vérifier si l'utilisateur a un FLYID
      const { data: flyAccount, error: flyError } = await supabase
        .from('fly_accounts')
        .select('id')
        .eq('auth_user_id', data.user.id)
        .single()

      if (flyError || !flyAccount) {
        setError('Aucun compte Flynesis trouvé. Veuillez créer un compte.')
        setIsLoading(false)
        return
      }

      // Rediriger vers le planner
      router.push('/planner')
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  const handleSignup = () => {
    window.location.href = 'https://account.flynesis.com/signup'
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A0A0F] via-[#1A0F1F] to-[#0F0A1A]">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary">Flynesis Planner</div>
          <div className="text-muted-foreground">Vérification...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0F0F1A] via-[#1A1525] to-[#151020] p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-border/60 shadow-glow-violet">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/20">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Flynesis Planner</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/20 border border-destructive/50 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full shadow-glow-violet"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Vous n&apos;avez pas encore de compte ?
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSignup}
              disabled={isLoading}
            >
              Créer un compte Flynesis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

