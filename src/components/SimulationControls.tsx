"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Play, Square, Zap, Clock, Plus, Link, Trash2, Save } from "lucide-react"

interface SimulationControlsProps {
  nodeTypes: any[]
  onAddNode: (type: string) => void
  onAddConnection: () => void
  onRunSimulation: (steps: number, isInstantMode: boolean) => void
  onStopSimulation: () => void
  onSaveReport: () => void
  onClearCanvas: () => void
  isRunning: boolean
  hasResults: boolean
  canvasId?: string
  simulationMode?: "instant" | "animated"
  onSimulationModeChange?: (mode: "instant" | "animated") => void
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  nodeTypes = [],
  onAddNode,
  onAddConnection,
  onRunSimulation,
  onStopSimulation,
  onSaveReport,
  onClearCanvas,
  isRunning,
  hasResults,
  canvasId,
  simulationMode = "instant",
  onSimulationModeChange,
}) => {
  const [activeTab, setActiveTab] = useState("nodes")
  const [steps, setSteps] = useState(100)

  const handleRunSimulation = () => {
    onRunSimulation(steps, simulationMode === "instant")
  }

  return (
    <div className="p-4 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-700">
          <TabsTrigger
            value="nodes"
            className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Узлы
          </TabsTrigger>
          <TabsTrigger
            value="simulation"
            className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Симуляция
          </TabsTrigger>
          <TabsTrigger
            value="actions"
            className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Действия
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white mb-3 border-b border-gray-700 pb-2">Доступные типы узлов</h3>
            {nodeTypes && nodeTypes.length > 0 ? (
              nodeTypes.map((nodeType) => (
                <Button
                  key={nodeType.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left mb-2 flex flex-col items-start p-3 bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                  onClick={() => onAddNode(nodeType.id)}
                >
                  <div className="flex items-center w-full">
                    <Plus className="h-4 w-4 mr-2 flex-shrink-0 text-emerald-400" />
                    <div className="truncate font-medium">{nodeType.name}</div>
                  </div>
                  {nodeType.description && (
                    <div className="text-xs text-gray-300 mt-1 w-full truncate pl-6">{nodeType.description}</div>
                  )}
                </Button>
              ))
            ) : (
              <div className="text-sm text-gray-300 p-2">Нет доступных типов узлов</div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-700 mt-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-gray-600 hover:bg-gray-500 text-white"
              onClick={onAddConnection}
            >
              <Link className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Создать соединение</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Режим симуляции</h3>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={simulationMode === "instant" ? "default" : "outline"}
                size="sm"
                className={`justify-start ${
                  simulationMode === "instant"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
                onClick={() => onSimulationModeChange && onSimulationModeChange("instant")}
              >
                <Zap className="h-4 w-4 mr-2" />
                Мгновенно
              </Button>

              <Button
                variant={simulationMode === "animated" ? "default" : "outline"}
                size="sm"
                className={`justify-start ${
                  simulationMode === "animated"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
                onClick={() => onSimulationModeChange && onSimulationModeChange("animated")}
              >
                <Clock className="h-4 w-4 mr-2" />С анимацией
              </Button>
            </div>

            <div className="bg-gray-700 rounded-md p-2 text-xs text-gray-300 mt-2">
              {simulationMode === "instant" ? (
                <>
                  <Badge variant="outline" className="mb-1 border-emerald-500 text-emerald-400">
                    Мгновенный режим
                  </Badge>
                  <p>Симуляция выполняется сразу, показывая только конечный результат.</p>
                </>
              ) : (
                <>
                  <Badge variant="outline" className="mb-1 border-emerald-500 text-emerald-400">
                    Режим с анимацией
                  </Badge>
                  <p>Симуляция выполняется пошагово с визуализацией процесса и промежуточных результатов.</p>
                </>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              variant="default"
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleRunSimulation}
              disabled={isRunning}
            >
              <Play className="h-4 w-4 mr-2" />
              Запустить симуляцию
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              onClick={onStopSimulation}
              disabled={!isRunning}
            >
              <Square className="h-4 w-4 mr-2" />
              Остановить
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              onClick={onSaveReport}
              disabled={!hasResults}
            >
              <Save className="h-4 w-4 mr-2" />
              Сохранить отчет
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="w-full justify-start bg-red-700 hover:bg-red-800 text-white"
              onClick={onClearCanvas}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Очистить холст
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SimulationControls
