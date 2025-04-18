"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { saveReport } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { SimulationParameters, SimulationResults } from "@/types"

interface ReportManagerProps {
  simulationType: string
  parameters: SimulationParameters
  results: SimulationResults
  onCapture?: () => Promise<Record<string, string>>
}

export const ReportManager: React.FC<ReportManagerProps> = ({ simulationType, parameters, results, onCapture }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSave = async () => {
    if (!title) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите название отчета",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      console.log("Capturing charts...")
      let charts = {}

      if (onCapture) {
        charts = await onCapture()
        console.log("Captured charts:", charts)
      } else {
        console.log("No capture function provided")
      }

      console.log("Saving report with data:", {
        title,
        description,
        simulationType,
        parameters: Object.keys(parameters).length,
        results: Object.keys(results).length,
        charts: Object.keys(charts).length,
        isPublic,
      })

      const response = await saveReport({
        title,
        description,
        simulationType,
        parameters,
        results,
        charts,
        isPublic,
      })

      console.log("Save report response:", response)

      toast({
        title: "Успех",
        description: "Отчет успешно сохранен",
      })

      setIsOpen(false)

      // Перенаправляем на страницу отчета
      if (response && response.id) {
        console.log(`Redirecting to /report/${response.id}`)
        navigate(`/report/${response.id}`)
      }
    } catch (error) {
      console.error("Error saving report:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить отчет",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        Сохранить отчет
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Сохранить отчет</DialogTitle>
            <DialogDescription>Сохраните результаты симуляции для последующего просмотра и анализа.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название отчета"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Добавьте описание отчета (необязательно)"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
              <Label htmlFor="public">Сделать отчет публичным</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ReportManager
