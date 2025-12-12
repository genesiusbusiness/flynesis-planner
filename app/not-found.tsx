import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0F0F1A] via-[#1A1525] to-[#151020]">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page non trouvée</h2>
        <p className="text-muted-foreground">
          La page que vous recherchez n&apos;existe pas.
        </p>
        <Link href="/planner">
          <Button className="mt-4 shadow-glow-violet">
            Retour au Planner
          </Button>
        </Link>
      </div>
    </div>
  )
}

