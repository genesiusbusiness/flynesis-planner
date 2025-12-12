'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings as SettingsType, CalendarView, WeekStart, TimeFormat } from '@/lib/types'
import { Download, Upload, Trash2 } from 'lucide-react'
import { getSettings, saveSettings, exportData, importData, resetData } from '@/lib/storage'

interface SettingsPanelProps {
  flyid: string
}

export function SettingsPanel({ flyid }: SettingsPanelProps) {
  const [settings, setSettings] = useState<SettingsType>({
    weekStart: 'Mon',
    timeFormat: '24h',
    defaultView: 'Week',
  })
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadSettings() {
      const loadedSettings = await getSettings(flyid)
      setSettings(loadedSettings)
      setIsLoading(false)
    }
    loadSettings()
  }, [flyid])

  const handleSettingChange = async <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    await saveSettings(newSettings, flyid)
  }

  const handleExport = async () => {
    const data = await exportData(flyid)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flynesis-planner-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      if (await importData(text, flyid)) {
        alert('Données importées avec succès!')
        window.location.reload()
      } else {
        alert('Erreur lors de l\'importation des données.')
      }
    }
    reader.readAsText(file)
  }

  const handleReset = async () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
      if (await resetData(flyid)) {
        alert('Données réinitialisées. Rechargement de la page...')
        window.location.reload()
      } else {
        alert('Erreur lors de la réinitialisation.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center text-muted-foreground">Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-card/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="weekStart">Début de semaine</Label>
              <Select
                value={settings.weekStart}
                onValueChange={(v) => handleSettingChange('weekStart', v as WeekStart)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mon">Lundi</SelectItem>
                  <SelectItem value="Sun">Dimanche</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeFormat">Format d&apos;heure</Label>
              <Select
                value={settings.timeFormat}
                onValueChange={(v) => handleSettingChange('timeFormat', v as TimeFormat)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 heures</SelectItem>
                  <SelectItem value="12h">12 heures (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultView">Vue par défaut</Label>
              <Select
                value={settings.defaultView}
                onValueChange={(v) => handleSettingChange('defaultView', v as CalendarView)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day">Jour</SelectItem>
                  <SelectItem value="Week">Semaine</SelectItem>
                  <SelectItem value="Month">Mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleExport} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button onClick={handleImport} variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <Button onClick={handleReset} variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Réinitialiser toutes les données
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

