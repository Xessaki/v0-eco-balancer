"use client"

import type React from "react"

import { useMemo, useRef, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CharacterCostChart } from "./CharacterCostChart"
import type {
  CharacterCostParameters,
  CharacterCostResults as CharacterCostResultsType,
} from "@/simulations/characterCost/types"
import { motion } from "framer-motion"

// Мемоизированный компонент для отображения метрики
const MetricCard = memo(
  ({
    title,
    value,
    description,
    variant = "default",
    formatter = (val) => val.toString(),
  }: {
    title: string
    value: number | string
    description?: string
    variant?: "default" | "success" | "warning" | "danger"
    formatter?: (value: number | string) => string
  }) => {
    // Определяем цвет в зависимости от варианта
    const colorClass = useMemo(() => {
      switch (variant) {
        case "success":
          return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        case "warning":
          return "bg-amber-500/10 border-amber-500/20 text-amber-400"
        case "danger":
          return "bg-red-500/10 border-red-500/20 text-red-400"
        default:
          return "bg-gray-800 border-gray-700 text-gray-300"
      }
    }, [variant])

    // Форматируем значение
    const formattedValue = useMemo(() => formatter(value), [value, formatter])

    return (
      <motion.div
        className={`p-4 rounded-lg border ${colorClass}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <div className="text-xl font-bold">{formattedValue}</div>
        {description && <p className="text-xs mt-1 text-gray-500">{description}</p>}
      </motion.div>
    )
  },
)
MetricCard.displayName = "MetricCard"

// Мемоизированный компонент для вкладки общих результатов
const SummaryTab = memo(
  ({
    results,
    parameters,
    registerChartRef,
  }: {
    results: CharacterCostResultsType
    parameters: CharacterCostParameters
    registerChartRef: (ref: React.RefObject<HTMLDivElement>) => React.RefObject<HTMLDivElement>
  }) => {
    // Создаем ref для графика
    const chartRef = useRef<HTMLDivElement>(null)

    // Регистрируем ref при монтировании компонента
    const registeredChartRef = useMemo(() => registerChartRef(chartRef), [registerChartRef])

    // Мемоизируем форматтеры
    const formatCurrency = useCallback((value: number) => `${value.toLocaleString()} ₽`, [])
    const formatHours = useCallback((value: number) => `${value.toFixed(0)} часов`, [])
    const formatDays = useCallback((value: number) => `${value.toFixed(0)} дней`, [])

    // Мемоизируем данные для графика распределения затрат
    const costBreakdownData = useMemo(() => {
      return [
        { name: "Моделирование", value: results.modelingCost },
        { name: "Текстурирование", value: results.texturingCost },
        { name: "Риггинг", value: results.riggingCost },
        { name: "Анимация", value: results.animationCost },
        { name: "Непредвиденные расходы", value: results.contingencyCost },
      ]
    }, [results])

    // Определяем вариант для общей стоимости
    const totalCostVariant = useMemo(() => {
      if (results.totalCost > parameters.budget) return "danger"
      if (results.totalCost > parameters.budget * 0.9) return "warning"
      return "success"
    }, [results.totalCost, parameters.budget])

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Общая стоимость"
            value={results.totalCost}
            formatter={formatCurrency}
            variant={totalCostVariant}
            description={
              results.totalCost > parameters.budget
                ? `Превышение бюджета на ${formatCurrency(results.totalCost - parameters.budget)}`
                : `В рамках бюджета (${formatCurrency(parameters.budget)})`
            }
          />
          <MetricCard title="Общее время работы" value={results.totalHours} formatter={formatHours} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Количество персонажей"
            value={results.characterCount}
            description={`Сложность: ${results.characterComplexity}/10`}
          />
          <MetricCard title="Время на персонажа" value={results.hoursPerCharacter} formatter={formatHours} />
          <MetricCard
            title="Длительность проекта"
            value={results.projectDuration}
            formatter={formatDays}
            variant={results.projectDuration > parameters.projectDuration ? "warning" : "default"}
            description={
              results.projectDuration > parameters.projectDuration
                ? `Превышение плана на ${formatDays(results.projectDuration - parameters.projectDuration)}`
                : `В рамках плана (${formatDays(parameters.projectDuration)})`
            }
          />
        </div>

        <div className="h-80" ref={registeredChartRef}>
          <CharacterCostChart
            data={costBreakdownData}
            title="Распределение затрат по категориям"
            registerChartRef={() => registeredChartRef}
          />
        </div>
      </div>
    )
  },
)
SummaryTab.displayName = "SummaryTab"

// Мемоизированный компонент для вкладки детализации
const DetailsTab = memo(
  ({
    results,
    parameters,
    registerChartRef,
  }: {
    results: CharacterCostResultsType
    parameters: CharacterCostParameters
    registerChartRef: (ref: React.RefObject<HTMLDivElement>) => React.RefObject<HTMLDivElement>
  }) => {
    // Создаем ref для графика
    const chartRef = useRef<HTMLDivElement>(null)

    // Регистрируем ref при монтировании компонента
    const registeredChartRef = useMemo(() => registerChartRef(chartRef), [registerChartRef])

    // Мемоизируем форматтеры
    const formatCurrency = useCallback((value: number) => `${value.toLocaleString()} ₽`, [])
    const formatHours = useCallback((value: number) => `${value.toFixed(0)} часов`, [])
    const formatPercent = useCallback((value: number) => `${value.toFixed(1)}%`, [])

    // Мемоизируем данные для графика распределения времени
    const timeBreakdownData = useMemo(() => {
      return [
        { name: "Моделирование", value: results.modelingHours },
        { name: "Текстурирование", value: results.texturingHours },
        { name: "Риггинг", value: results.riggingHours },
        { name: "Анимация", value: results.animationHours },
      ]
    }, [results])

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Затраты по категориям</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Моделирование:</span>
                <span className="text-sm font-medium text-gray-300">{formatCurrency(results.modelingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Текстурирование:</span>
                <span className="text-sm font-medium text-gray-300">{formatCurrency(results.texturingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Риггинг:</span>
                <span className="text-sm font-medium text-gray-300">{formatCurrency(results.riggingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Анимация:</span>
                <span className="text-sm font-medium text-gray-300">{formatCurrency(results.animationCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Непредвиденные расходы:</span>
                <span className="text-sm font-medium text-gray-300">{formatCurrency(results.contingencyCost)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                <span className="text-sm font-medium text-gray-300">Общая стоимость:</span>
                <span className="text-sm font-medium text-emerald-400">{formatCurrency(results.totalCost)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Распределение времени</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Моделирование:</span>
                <span className="text-sm font-medium text-gray-300">{formatHours(results.modelingHours)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Текстурирование:</span>
                <span className="text-sm font-medium text-gray-300">{formatHours(results.texturingHours)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Риггинг:</span>
                <span className="text-sm font-medium text-gray-300">{formatHours(results.riggingHours)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Анимация:</span>
                <span className="text-sm font-medium text-gray-300">{formatHours(results.animationHours)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                <span className="text-sm font-medium text-gray-300">Общее время:</span>
                <span className="text-sm font-medium text-blue-400">{formatHours(results.totalHours)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-80" ref={registeredChartRef}>
          <CharacterCostChart
            data={timeBreakdownData}
            title="Распределение времени по категориям"
            registerChartRef={() => registeredChartRef}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Эффективность использования бюджета"
            value={results.budgetEfficiency}
            formatter={formatPercent}
            variant={results.budgetEfficiency > 90 ? "success" : results.budgetEfficiency > 70 ? "warning" : "danger"}
            description="Процент бюджета, использованный эффективно"
          />
          <MetricCard
            title="Риск превышения бюджета"
            value={results.budgetOverrunRisk}
            formatter={formatPercent}
            variant={results.budgetOverrunRisk < 20 ? "success" : results.budgetOverrunRisk < 50 ? "warning" : "danger"}
            description="Вероятность превышения бюджета"
          />
        </div>
      </div>
    )
  },
)
DetailsTab.displayName = "DetailsTab"

// Мемоизированный компонент для вкладки рисков
const RisksTab = memo(
  ({
    results,
    registerChartRef,
  }: {
    results: CharacterCostResultsType
    registerChartRef: (ref: React.RefObject<HTMLDivElement>) => React.RefObject<HTMLDivElement>
  }) => {
    // Создаем ref для графика
    const chartRef = useRef<HTMLDivElement>(null)

    // Регистрируем ref при монтировании компонента
    const registeredChartRef = useMemo(() => registerChartRef(chartRef), [registerChartRef])

    // Мемоизируем форматтеры
    const formatPercent = useCallback((value: number) => `${value.toFixed(1)}%`, [])
    const formatCurrency = useCallback((value: number) => `${value.toLocaleString()} ₽`, [])

    // Мемоизируем данные для графика рисков
    const riskData = useMemo(() => {
      return [
        { name: "Задержки", value: results.delayRisk },
        { name: "Превышение бюджета", value: results.budgetOverrunRisk },
        { name: "Технические проблемы", value: results.technicalRisk },
        { name: "Качество", value: results.qualityRisk },
      ]
    }, [results])

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Риск задержек"
            value={results.delayRisk}
            formatter={formatPercent}
            variant={results.delayRisk < 30 ? "success" : results.delayRisk < 60 ? "warning" : "danger"}
            description="Вероятность задержки проекта"
          />
          <MetricCard
            title="Риск превышения бюджета"
            value={results.budgetOverrunRisk}
            formatter={formatPercent}
            variant={results.budgetOverrunRisk < 30 ? "success" : results.budgetOverrunRisk < 60 ? "warning" : "danger"}
            description="Вероятность превышения бюджета"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Технический риск"
            value={results.technicalRisk}
            formatter={formatPercent}
            variant={results.technicalRisk < 30 ? "success" : results.technicalRisk < 60 ? "warning" : "danger"}
            description="Вероятность технических проблем"
          />
          <MetricCard
            title="Риск качества"
            value={results.qualityRisk}
            formatter={formatPercent}
            variant={results.qualityRisk < 30 ? "success" : results.qualityRisk < 60 ? "warning" : "danger"}
            description="Вероятность проблем с качеством"
          />
        </div>

        <div className="h-80" ref={registeredChartRef}>
          <CharacterCostChart
            data={riskData}
            title="Распределение рисков"
            registerChartRef={() => registeredChartRef}
          />
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-300">Рекомендации по снижению рисков</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-400">
            <ul className="list-disc pl-5 space-y-2">
              {results.delayRisk > 50 && (
                <li>
                  <strong>Высокий риск задержек:</strong> Рассмотрите возможность увеличения команды или упрощения
                  некоторых персонажей.
                </li>
              )}
              {results.budgetOverrunRisk > 50 && (
                <li>
                  <strong>Высокий риск превышения бюджета:</strong> Увеличьте бюджет на{" "}
                  {formatCurrency(results.recommendedBudgetIncrease)} или уменьшите количество персонажей.
                </li>
              )}
              {results.technicalRisk > 50 && (
                <li>
                  <strong>Высокий технический риск:</strong> Рассмотрите возможность использования готовых решений или
                  упрощения технических требований.
                </li>
              )}
              {results.qualityRisk > 50 && (
                <li>
                  <strong>Высокий риск качества:</strong> Увеличьте время на моделирование и текстурирование или
                  уменьшите количество персонажей.
                </li>
              )}
              {results.delayRisk <= 50 &&
                results.budgetOverrunRisk <= 50 &&
                results.technicalRisk <= 50 &&
                results.qualityRisk <= 50 && (
                  <li>
                    <strong>Риски в пределах нормы:</strong> Продолжайте мониторинг проекта и регулярно обновляйте
                    оценки.
                  </li>
                )}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  },
)
RisksTab.displayName = "RisksTab"

// Основной компонент результатов
const CharacterCostResults = ({
  results,
  parameters,
  registerChartRef,
}: {
  results: CharacterCostResultsType
  parameters: CharacterCostParameters
  registerChartRef: (ref: React.RefObject<HTMLDivElement>) => React.RefObject<HTMLDivElement>
}) => {
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="summary">Сводка</TabsTrigger>
          <TabsTrigger value="details">Детализация</TabsTrigger>
          <TabsTrigger value="risks">Риски</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="summary">
            <SummaryTab results={results} parameters={parameters} registerChartRef={registerChartRef} />
          </TabsContent>
          <TabsContent value="details">
            <DetailsTab results={results} parameters={parameters} registerChartRef={registerChartRef} />
          </TabsContent>
          <TabsContent value="risks">
            <RisksTab results={results} registerChartRef={registerChartRef} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}

export default memo(CharacterCostResults)
