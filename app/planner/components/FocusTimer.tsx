'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Task } from '@/lib/types'
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react'
import { getFocusSessions, saveFocusSession } from '@/lib/storage'
import { getDateISO } from '@/lib/date'

interface FocusTimerProps {
  tasks: Task[]
  flyid: string
}

export function FocusTimer({ tasks, flyid }: FocusTimerProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [todayCount, setTodayCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function loadTodayCount() {
      const sessions = await getFocusSessions(flyid)
      const today = getDateISO()
      const todaySessions = sessions.filter((s) => s.completedAtISO.startsWith(today))
      setTodayCount(todaySessions.length)
    }
    loadTodayCount()
  }, [flyid])

  const handleComplete = useCallback(async () => {
    setIsRunning(false)
    if (!isBreak) {
      // Save session
      const session = {
        id: `session-${Date.now()}`,
        taskId: selectedTaskId && selectedTaskId !== 'none' ? selectedTaskId : undefined,
        duration: workDuration,
        completedAtISO: new Date().toISOString(),
      }
      await saveFocusSession(session, flyid)
      
      // Update today count
      const sessions = await getFocusSessions(flyid)
      const today = getDateISO()
      const todaySessions = sessions.filter((s) => s.completedAtISO.startsWith(today))
      setTodayCount(todaySessions.length)

      // Switch to break
      setIsBreak(true)
      setTimeLeft(breakDuration * 60)
    } else {
      // Break finished, reset to work
      setIsBreak(false)
      setTimeLeft(workDuration * 60)
    }
  }, [isBreak, selectedTaskId, workDuration, breakDuration, flyid])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, handleComplete])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(workDuration * 60)
  }

  const todoTasks = tasks.filter((t) => t.status === 'Todo' || t.status === 'Doing')

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-card/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl">Focus Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-4 text-primary">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">
                {isBreak ? 'Pause' : 'Travail'}
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button
                onClick={isRunning ? handlePause : handleStart}
                size="lg"
                className="shadow-glow-violet"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Démarrer
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Durée travail (min)</label>
                <Select
                  value={workDuration.toString()}
                  onValueChange={(v) => {
                    setWorkDuration(Number(v))
                    if (!isRunning && !isBreak) {
                      setTimeLeft(Number(v) * 60)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 25, 30, 45, 60].map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Durée pause (min)</label>
                <Select
                  value={breakDuration.toString()}
                  onValueChange={(v) => setBreakDuration(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tâche à focus (optionnel)</label>
              <Select 
                value={selectedTaskId || 'none'} 
                onValueChange={(value) => setSelectedTaskId(value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucune tâche sélectionnée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {todoTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{todayCount}</div>
            <div className="text-sm text-muted-foreground">
              Sessions complétées aujourd&apos;hui
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

