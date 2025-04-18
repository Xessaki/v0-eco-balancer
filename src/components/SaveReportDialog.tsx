"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/api"
import { useNavigate } from "react-router-dom"

interface SaveReportDialogProps {
  isOpen: boolean
  onClose: () => void
  simulationType: string
  parameters: any
  results: any
}

export default function SaveReportDialog({
  isOpen,
  onClose,
  simulationType,
  parameters,
  results,
}: SaveReportDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSave = async () => {
    if (!title) {
      setError("Название отчета обязательно")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const response = await api.post("/reports", {
        title,
        description,
        simulation_type: simulationType,
        parameters,
        results,
        is_public: isPublic,
      })

      // После успешного сохранения перенаправляем на страницу отчета
      navigate(`/reports/${response.data.id}`)
      onClose()
    } catch (err) {
      console.error("Error saving report:", err)
      setError("Ошибка при сохранении отчета")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Сохранить отчет</DialogTitle>
          <DialogDescription className="text-gray-400">
            Сохраните результаты симуляции для последующего просмотра
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Название отчета
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Введите название отчета"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Описание (необязательно)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white h-24"
              placeholder="Добавьте описание отчета"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="public" className="text-gray-300">
              Сделать отчет п��бличным
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
