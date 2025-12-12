'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, CheckSquare, Focus, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

interface PlannerShellProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export function PlannerShell({ activeTab, onTabChange, children }: PlannerShellProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'focus', label: 'Focus', icon: Focus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-auto pb-20">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/90 backdrop-blur-lg z-50">
          <div className="flex items-center justify-around h-16">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs font-medium">Déconnexion</span>
            </button>
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r border-border/60 bg-background/70 backdrop-blur-md flex flex-col">
        <div className="p-4 flex-1">
          <h2 className="text-lg font-semibold mb-4">Navigation</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary shadow-glow-violet'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-border/50">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

