'use client'

import { useState, useMemo } from 'react'
import { Task, TaskStatus, Priority } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search } from 'lucide-react'
import { formatDate, isToday, getDateISO } from '@/lib/date'
import { cn } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TasksBoardProps {
  tasks: Task[]
  onTaskUpdate: (task: Task) => void
  onTaskDelete: (id: string) => void
  onAddTask: () => void
  onTaskClick: (task: Task) => void
  searchQuery: string
}

const STATUSES: TaskStatus[] = ['Todo', 'Doing', 'Done']

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue = task.dueISO && !isToday(task.dueISO) && new Date(task.dueISO) < new Date()

  const priorityColors = {
    High: 'bg-red-500/20 text-red-400 border-red-500/50',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    Low: 'bg-green-500/20 text-green-400 border-green-500/50',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
        className={cn(
          'p-3 rounded-xl border border-border/60 bg-card/70 backdrop-blur-md cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]',
          isOverdue && 'ring-2 ring-red-500'
        )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="font-medium mb-1">{task.title}</div>
          <div className="flex items-center gap-2 flex-wrap">
            {task.tag && (
              <Badge variant="outline" className="text-xs">
                {task.tag}
              </Badge>
            )}
            <Badge variant="outline" className={cn('text-xs', priorityColors[task.priority])}>
              {task.priority}
            </Badge>
            {task.dueISO && (
              <span className={cn('text-xs', isOverdue ? 'text-red-400' : 'text-muted-foreground')}>
                {isOverdue ? '⚠️ ' : ''}
                {formatDate(task.dueISO, 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TasksBoard({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onAddTask,
  onTaskClick,
  searchQuery,
}: TasksBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks
    const query = searchQuery.toLowerCase()
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.tag?.toLowerCase().includes(query)
    )
  }, [tasks, searchQuery])

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      Todo: [],
      Doing: [],
      Done: [],
    }
    filteredTasks.forEach((task) => {
      grouped[task.status].push(task)
    })
    return grouped
  }, [filteredTasks])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if dragging between columns
    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    const overStatus = STATUSES.find((s) => overId === s)
    if (overStatus && activeTask.status !== overStatus) {
      onTaskUpdate({ ...activeTask, status: overStatus })
      return
    }

    // Reorder within same column
    const activeStatus = activeTask.status
    const statusTasks = tasksByStatus[activeStatus]
    const oldIndex = statusTasks.findIndex((t) => t.id === activeId)
    const newIndex = statusTasks.findIndex((t) => t.id === overId)

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const newTasks = arrayMove(statusTasks, oldIndex, newIndex)
      newTasks.forEach((task, index) => {
        // Update order if needed (simplified - just update the dragged task)
      })
    }
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tâches</h2>
        <Button onClick={onAddTask} className="shadow-glow-violet">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUSES.map((status) => {
            const statusTasks = tasksByStatus[status]
            return (
              <Card key={status} className="bg-card/70 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {status} ({statusTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={statusTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {statusTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={() => onTaskClick(task)}
                        />
                      ))}
                      {statusTasks.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-8">
                          Aucune tâche
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DndContext>
    </div>
  )
}

