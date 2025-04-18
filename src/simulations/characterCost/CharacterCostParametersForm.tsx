"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles } from 'lucide-react'
import { motion } from "framer-motion"
import type { CharacterCostParameters } from "@/simulations/characterCost/types"
import { CharacterCostChart } from "./CharacterCostChart"

// Мемоизированный компонент для слайдера с меткой
const LabeledSlider = memo(
  ({
    label,
    value,
    onChange,
    min,
    max,
    step,
    disabled = false,
    valueFormatter = (val) => val.toString(),
  }: {
    label: string
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    step: number
    disabled?: boolean
    valueFormatter?: (value: number) => string
  }) => {
    // Мемоизируем обработчик изменения слайдера
    const handleSliderChange = useCallback(
      (values: number[]) => {
        onChange(values[0])
      },
      [onChange],
    )

    // Мемоизируем форматированное значение
    const formattedValue = useMemo(() => valueFormatter(value), [value, valueFormatter])

    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm text-gray-400">{label}</Label>
          <span className="text-sm font-medium text-gray-300">{formattedValue}</span>
        </div>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          disabled={disabled}
          className={disabled ? "opacity-50" : ""}
        />
      </div>
    )
  },
)
LabeledSlider.displayName = "LabeledSlider"

// Мемоизированный компонент для переключателя с меткой
const LabeledSwitch = memo(
  ({
    label,
    checked,
    onCheckedChange,
    disabled = false,
  }: {
    label: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
  }) => {
    return (
      <div className="flex items-center justify-between">
        <Label className="text-sm text-gray-400">{label}</Label>
        <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
      </div>
    )
  },
)
LabeledSwitch.displayName = "LabeledSwitch"

// Мемоизированный компонент для поля ввода с меткой
const LabeledInput = memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    disabled = false,
    min,
    max,
    step,
  }: {
    label: string
    value: string | number
    onChange: (value: string) => void
    type?: string
    disabled?: boolean
    min?: number
    max?: number
    step?: number
  }) => {
    // Мемоизируем обработчик изменения поля ввода
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
      },
      [onChange],
    )

    return (
      <div className="space-y-2">
        <Label className="text-sm text-gray-400">{label}</Label>
        <Input
          type={type}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={disabled ? "opacity-50" : ""}
        />
      </div>
    )
  },
)
LabeledInput.displayName = "LabeledInput"

// Мемоизированный компонент для вкладки базовых параметров
const BasicParametersTab = memo(
  ({
    parameters,
    updateParameter,
    isRunning,
  }: {
    parameters: CharacterCostParameters
    updateParameter: (key: string, value: any) => void
    isRunning: boolean
  }) => {
    // Мемоизируем форматтеры для слайдеров
    const formatCurrency = useCallback((value: number) => `${value.toLocaleString()} ₽`, [])
    const formatPercent = useCallback((value: number) => `${value}%`, [])
    const formatDays = useCallback((value: number) => `${value} дней`, [])

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Финансовые параметры</h3>
          <LabeledSlider
            label="Бюджет проекта"
            value={parameters.budget}
            onChange={(value) => updateParameter("budget", value)}
            min={100000}
            max={10000000}
            step={100000}
            disabled={isRunning}
            valueFormatter={formatCurrency}
          />
          <LabeledSlider
            label="Средняя зарплата разработчика"
            value={parameters.averageSalary}
            onChange={(value) => updateParameter("averageSalary", value)}
            min={50000}
            max={500000}
            step={10000}
            disabled={isRunning}
            valueFormatter={formatCurrency}
          />
          <LabeledSlider
            label="Налоги и отчисления"
            value={parameters.taxRate}
            onChange={(value) => updateParameter("taxRate", value)}
            min={0}
            max={50}
            step={1}
            disabled={isRunning}
            valueFormatter={formatPercent}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Временные параметры</h3>
          <LabeledSlider
            label="Длительность проекта"
            value={parameters.projectDuration}
            onChange={(value) => updateParameter("projectDuration", value)}
            min={30}
            max={365}
            step={5}
            disabled={isRunning}
            valueFormatter={formatDays}
          />
          <LabeledSlider
            label="Рабочих дней в месяце"
            value={parameters.workdaysPerMonth}
            onChange={(value) => updateParameter("workdaysPerMonth", value)}
            min={15}
            max={25}
            step={1}
            disabled={isRunning}
          />
          <LabeledSlider
            label="Рабочих часов в день"
            value={parameters.hoursPerDay}
            onChange={(value) => updateParameter("hoursPerDay", value)}
            min={4}
            max={12}
            step={1}
            disabled={isRunning}
          />
        </div>
      </div>
    )
  },
)
BasicParametersTab.displayName = "BasicParametersTab"

// Мемоизированный компонент для вкладки параметров персонажей
const CharacterParametersTab = memo(
  ({
    parameters,
    updateParameter,
    isRunning,
  }: {
    parameters: CharacterCostParameters
    updateParameter: (key: string, value: any) => void
    isRunning: boolean
  }) => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Параметры персонажей</h3>
          <LabeledSlider
            label="Количество персонажей"
            value={parameters.characterCount}
            onChange={(value) => updateParameter("characterCount", value)}
            min={1}
            max={100}
            step={1}
            disabled={isRunning}
          />
          <LabeledSlider
            label="Сложность персонажей (1-10)"
            value={parameters.characterComplexity}
            onChange={(value) => updateParameter("characterComplexity", value)}
            min={1}
            max={10}
            step={1}
            disabled={isRunning}
          />
          <LabeledSlider
            label="Количество анимаций на персонажа"
            value={parameters.animationsPerCharacter}
            onChange={(value) => updateParameter("animationsPerCharacter", value)}
            min={1}
            max={50}
            step={1}
            disabled={isRunning}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Дополнительные параметры</h3>
          <LabeledSwitch
            label="Высокодетализированные модели"
            checked={parameters.highDetailModels}
            onCheckedChange={(checked) => updateParameter("highDetailModels", checked)}
            disabled={isRunning}
          />
          <LabeledSwitch
            label="Фотореалистичные текстуры"
            checked={parameters.photoRealisticTextures}
            onCheckedChange={(checked) => updateParameter("photoRealisticTextures", checked)}
            disabled={isRunning}
          />
          <LabeledSwitch
            label="Продвинутая система физики"
            checked={parameters.advancedPhysics}
            onCheckedChange={(checked) => updateParameter("advancedPhysics", checked)}
            disabled={isRunning}
          />
        </div>
      </div>
    )
  },
)
CharacterParametersTab.displayName = "CharacterParametersTab"

// Мемоизированный компонент для вкладки дополнительных параметров
const AdvancedParametersTab = memo(
  ({
    parameters,
    updateParameter,
    isRunning,
  }: {
    parameters: CharacterCostParameters
    updateParameter: (key: string, value: any) => void
    isRunning: boolean
  }) => {
    // Мемоизируем форматтеры для слайдеров
    const formatHours = useCallback((value: number) => `${value} часов`, [])
    const formatPercent = useCallback((value: number) => `${value}%`, [])

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Параметры разработки</h3>
          <LabeledSlider
            label="Время на моделирование (часов)"
            value={parameters.modelingTime}
            onChange={(value) => updateParameter("modelingTime", value)}
            min={1}
            max={200}
            step={1}
            disabled={isRunning}
            valueFormatter={formatHours}
          />
          <LabeledSlider
            label="Время на текстурирование (часов)"
            value={parameters.texturingTime}
            onChange={(value) => updateParameter("texturingTime", value)}
            min={1}
            max={100}
            step={1}
            disabled={isRunning}
            valueFormatter={formatHours}
          />
          <LabeledSlider
            label="Время на риггинг (часов)"
            value={parameters.riggingTime}
            onChange={(value) => updateParameter("riggingTime", value)}
            min={1}
            max={100}
            step={1}
            disabled={isRunning}
            valueFormatter={formatHours}
          />
          <LabeledSlider
            label="Время на анимацию (часов на анимацию)"
            value={parameters.animationTime}
            onChange={(value) => updateParameter("animationTime", value)}
            min={1}
            max={100}
            step={1}
            disabled={isRunning}
            valueFormatter={formatHours}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Риски и непредвиденные расходы</h3>
          <LabeledSlider
            label="Резерв на непредвиденные расходы"
            value={parameters.contingencyReserve}
            onChange={(value) => updateParameter("contingencyReserve", value)}
            min={0}
            max={50}
            step={1}
            disabled={isRunning}
            valueFormatter={formatPercent}
          />
          <LabeledSlider
            label="Вероятность задержек"
            value={parameters.delayProbability}
            onChange={(value) => updateParameter("delayProbability", value)}
            min={0}
            max={100}
            step={1}
            disabled={isRunning}
            valueFormatter={formatPercent}
          />
          <LabeledSlider
            label="Средняя длительность задержки (дней)"
            value={parameters.averageDelayDuration}
            onChange={(value) => updateParameter("averageDelayDuration", value)}
            min={0}
            max={60}
            step={1}
            disabled={isRunning}
          />
        </div>
      </div>
    )
  },
)
AdvancedParametersTab.displayName = "AdvancedParametersTab"

// Мемоизированный компонент для предпросмотра
const PreviewTab = memo(
  ({
    parameters,
    registerChartRef,
  }: {
    parameters: CharacterCostParameters
    registerChartRef: (ref: React.RefObject<HTMLDivElement>) => React.RefObject<HTMLDivElement>
  }) => {
    // Мемоизируем данные для предпросмотра
    const previewData = useMemo(() => {
      // Простой расчет для предпросмотра
      const totalHoursPerCharacter =
        parameters.modelingTime +
        parameters.texturingTime +
        parameters.riggingTime +
        parameters.animationTime * parameters.animationsPerCharacter

      const totalHours = totalHoursPerCharacter * parameters.characterCount
      const totalCost = (parameters.averageSalary / (parameters.workdaysPerMonth * parameters.hoursPerDay)) * totalHours
      const totalCostWithTax = totalCost * (1 + parameters.taxRate / 100)
      const totalCostWithContingency = totalCostWithTax * (1 + parameters.contingencyReserve / 100)

      // Распределение затрат по категориям
      const modelingCost = (parameters.modelingTime / totalHoursPerCharacter) * totalCostWithContingency
      const texturingCost = (parameters.texturingTime / totalHoursPerCharacter) * totalCostWithContingency
      const riggingCost = (parameters.riggingTime / totalHoursPerCharacter) * totalCostWithContingency
      const animationCost =
        ((parameters.animationTime * parameters.animationsPerCharacter) / totalHoursPerCharacter) *
        totalCostWithContingency

      return {
        totalHours,
        totalCost: totalCostWithContingency,
        costBreakdown: [
          { name: "Моделирование", value: modelingCost },
          { name: "Текстурирование", value: texturingCost },
          { name: "Риггинг", value: riggingCost },
          { name: "Анимация", value: animationCost },
        ],
        withinBudget: totalCostWithContingency <= parameters.budget,
      }
    }, [parameters])

    return (
      <div className="space-y-6">
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Предварительная оценка</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Общее время работы:</span>
              <span className="text-sm font-medium text-gray-300">{previewData.totalHours.toFixed(0)} часов</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Предварительная стоимость:</span>
              <span className={`text-sm font-medium ${previewData.withinBudget ? "text-emerald-400" : "text-red-400"}`}>
                {previewData.totalCost.toLocaleString()} ₽
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Бюджет проекта:</span>
              <span className="text-sm font-medium text-gray-300">{parameters.budget.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Статус:</span>
              <span className={`text-sm font-medium ${previewData.withinBudget ? "text-emerald-400" : "text-red-400"}`}>
                {previewData.withinBudget ? "В рамках бюджета" : "Превышение бюджета"}
              </span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <CharacterCostChart
            data={previewData.costBreakdown}
            title="Предварительное распределение затрат"
            registerChartRef={registerChartRef}
          />
        </div>

        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Примечание</h3>
          <p className="text-sm text-gray-400">
            Это предварительная оценка, основанная на введенных параметрах. Фактические результаты симуляции могут
            отличаться с учетом случайных факторов и рисков.
          </p>
        </div>
      </div>
    )
  },
)
PreviewTab.displayName = "PreviewTab"

// Основной компонент формы параметров
const CharacterCostParametersForm = ({
  parameters: initialParameters,
  onChange,
  onRun,
  isRunning,
  registerChartRef,
}: {
  parameters: CharacterCostParameters
  onChange: (parameters: CharacterCostParameters) => void
  onRun: () => void
  isRunning: boolean
  registerChartRef: (ref: React.RefObject<HTMLDivElement>) => React.RefObject<HTMLDivElement>
}) => {
  // Локальное состояние для параметров
  const [parameters, setParameters] = useState<CharacterCostParameters>(initialParameters)
  const [activeTab, setActiveTab] = useState("basic")

  // Обновляем локальное состояние при изменении входных параметров
  useEffect(() => {
    setParameters(initialParameters)
  }, [initialParameters])

  // Мемоизированный обработчик для обновления отдельного параметра
  const updateParameter = useCallback(
    (key: string, value: any) => {
      const updatedParameters = {
        ...parameters,
        [key]: value,
      }
      setParameters(updatedParameters)
      onChange(updatedParameters)
    },
    [parameters, onChange],
  )

  // Мемоизированный обработчик для запуска симуляции
  const handleRunClick = useCallback(() => {
    onRun()
  }, [onRun])

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="basic">Основные</TabsTrigger>
          <TabsTrigger value="characters">Персонажи</TabsTrigger>
          <TabsTrigger value="advanced">Расширенные</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="basic">
            <BasicParametersTab parameters={parameters} updateParameter={updateParameter} isRunning={isRunning} />
          </TabsContent>
          <TabsContent value="characters">
            <CharacterParametersTab parameters={parameters} updateParameter={updateParameter} isRunning={isRunning} />
          </TabsContent>
          <TabsContent value="advanced">
            <AdvancedParametersTab parameters={parameters} updateParameter={updateParameter} isRunning={isRunning} />
          </TabsContent>
          <TabsContent value="preview">
            <PreviewTab parameters={parameters} registerChartRef={registerChartRef} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setActiveTab("preview")}
          disabled={isRunning}
          className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-gray-200"
        >
          Предпросмотр
        </Button>
        <Button
          onClick={handleRunClick}
          disabled={isRunning}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 relative group overflow-hidden"
        >
          <span className="relative z-10 flex items-center">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Запустить симуляцию
          </span>
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
            initial={{ x: "100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.4 }}
          />
        </Button>
      </div>
    </div>
  )
}

export default memo(CharacterCostParametersForm)