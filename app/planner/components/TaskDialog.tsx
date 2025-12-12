'use client'

import { useState, useEffect } from 'react'
import { Task, Priority } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getDateISO } from '@/lib/date'

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  onSave: (task: Task) => void
  onDelete?: (id: string) => void
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSave,
  onDelete,
}: TaskDialogProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [tag, setTag] = useState('')
  const [dueISO, setDueISO] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setPriority(task.priority)
      setTag(task.tag || '')
      setDueISO(task.dueISO || '')
    } else {
      setTitle('')
      setPriority('Medium')
      setTag('')
      setDueISO('')
    }
  }, [task])

  const handleSave = () => {
    if (!title.trim()) return

    const taskData: Task = {
      id: task?.id || `task-${Date.now()}`,
      title: title.trim(),
      status: task?.status || 'Todo',
      priority,
      tag: tag.trim() || undefined,
      dueISO: dueISO || undefined,
      createdAtISO: task?.createdAtISO || new Date().toISOString(),
    }

    onSave(taskData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nom de la tâche"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Tag optionnel"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="dueDate">Date d&apos;échéance</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueISO}
              onChange={(e) => setDueISO(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          {task && onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id)
                onOpenChange(false)
              }}
            >
              Supprimer
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

