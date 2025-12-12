'use client'

import { format } from 'date-fns'
import { Calendar, Plus, Search, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarView } from '@/lib/types'

interface TopBarProps {
  currentDate: Date
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onAddClick: () => void
  onTodayClick: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TopBar({
  currentDate,
  view,
  onViewChange,
  onAddClick,
  onTodayClick,
  searchQuery,
  onSearchChange,
}: TopBarProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Flynesis Planner</h1>
            <p className="text-sm text-muted-foreground">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onTodayClick}>
            <CalendarDays className="h-4 w-4" />
          </Button>
          <Button onClick={onAddClick} className="shadow-glow-violet">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-xl bg-muted/50 p-1">
          {(['Day', 'Week', 'Month'] as CalendarView[]).map((v) => (
            <Button
              key={v}
              variant={view === v ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange(v)}
              className="rounded-lg"
            >
              {v}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

