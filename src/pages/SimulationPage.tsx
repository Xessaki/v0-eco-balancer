"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { simulationRegistry } from "@/simulations/registry"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Save, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { simulationService } from "@/services/simulation-service"
import { Switch } from "@/components/ui/switch"
import ReportManager from "@/components/ReportManager"
import { motion } from "framer-motion"

// Мемоизированный компонент для заголовка симуляции
const SimulationHeader = memo(({ simulation }) => (
  <motion.header
    className="bg-gray-800 p-4 border-b border-gray-700 relative overflow-hidden"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {/* Декоративный фон для заголовка */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
    </div>

    <div className="relative z-10">
      <div className="flex items-center">
        <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md text-emerald-500 mr-3 relative">
          {simulation.icon && <simulation.icon className="h-6 w-6" />}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="h-10 w-10 rounded-md bg-emerald-500 filter blur-md opacity-20"></div>
          </motion.div>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
          {simulation.name}
        </h1>
      </div>
      <p className="text-sm text-gray-400 mt-1">{simulation.description}</p>
    </div>
  </motion.header>
))
SimulationHeader.displayName = "SimulationHeader"

// Мемоизированный компонент для панели параметров
const ParametersPanel = memo(
  ({
    isPanelCollapsed,
    setIsPanelCollapsed,
    ParametersForm,
    parameters,
    setParameters,
    handleRunSimulation,
    isRunning,
    useWorkerSimulation,
    setUseWorkerSimulation,
    useServerSimulation,
    setUseServerSimulation,
    registerChartRef,
  }) => (
    <motion.div
      className={`${
        isPanelCollapsed ? "w-12" : "w-1/3"
      } bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 relative overflow-hidden`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Декоративный фон для панели параметров */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-500/5 to-transparent"></div>
      </div>

      <div className="flex justify-between items-center p-4 border-b border-gray-700 relative z-10">
        {!isPanelCollapsed && <h2 className="text-lg font-medium text-white">Параметры</h2>}
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
        >
          {isPanelCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto ${isPanelCollapsed ? "hidden" : "p-4"} relative z-10`}>
        {ParametersForm ? (
          <ParametersForm
            parameters={parameters}
            onChange={setParameters}
            onRun={handleRunSimulation}
            isRunning={isRunning}
            registerChartRef={registerChartRef}
          />
        ) : (
          <div className="p-4 text-center">
            <p className="text-red-400">Ошибка: Компонент параметров не найден</p>
          </div>
        )}

        {/* Настройки производительности */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Настройки производительности</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Использовать Web Worker</label>
              <Switch
                checked={useWorkerSimulation}
                onCheckedChange={(checked) => {
                  setUseWorkerSimulation(checked)
                  if (checked) {
                    setUseServerSimulation(false)
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Использовать серверную симуляцию</label>
              <Switch
                checked={useServerSimulation}
                onCheckedChange={(checked) => {
                  setUseServerSimulation(checked)
                  if (checked) {
                    setUseWorkerSimulation(false)
                  }
                }}
              />
            </div>

            <div className="bg-gray-700 p-3 rounded-md text-xs text-gray-300">
              <p className="mb-2">
                <strong>Web Worker:</strong> Выполняет симуляцию в отдельном потоке браузера, не блокируя интерфейс.
              </p>
              <p>
                <strong>Серверная симуляция:</strong> Выполняет симуляцию на сервере, снижая нагрузку на устройство
                пользователя.
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isPanelCollapsed && (
        <div className="p-4 border-t border-gray-700 relative z-10">
          <Button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 relative group overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              {isRunning ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Выполняется...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Запустить симуляцию
                </>
              )}
            </span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </Button>
        </div>
      )}
    </motion.div>
  ),
)
ParametersPanel.displayName = "ParametersPanel"

// Мемоизированный компонент для прогресс-бара
const SimulationProgress = memo(({ simulationProgress, handleCancelSimulation, simulationMode }) => (
  <motion.div
    className="p-4 bg-gray-800 border-b border-gray-700 relative z-10"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-center mb-2">
      <div className="text-sm text-gray-300">{simulationProgress.status}</div>
      <Button variant="ghost" size="sm" onClick={handleCancelSimulation} className="text-gray-400 hover:text-white">
        <X size={16} className="mr-1" />
        Отменить
      </Button>
    </div>
    <Progress
      value={simulationProgress.percentage}
      className="h-2 bg-gray-700"
      indicatorClassName="bg-gradient-to-r from-emerald-500 to-blue-500"
    />
    <div className="flex justify-between text-xs text-gray-400 mt-1">
      <span>
        {simulationMode === "server"
          ? "Серверная симуляция"
          : simulationMode === "worker"
            ? "Web Worker"
            : "Основной поток"}
      </span>
      <span>{simulationProgress.percentage}%</span>
    </div>
  </motion.div>
))
SimulationProgress.displayName = "SimulationProgress"

// Мемоизированный компонент для кнопки сохранения отчета
const SaveReportButton = memo(({ handleOpenReportManager }) => (
  <motion.div
    className="flex justify-end mb-4"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Button
      onClick={handleOpenReportManager}
      className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 group relative overflow-hidden"
    >
      <span className="relative z-10 flex items-center">
        <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
        Сохранить отчет
      </span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
        initial={{ x: "100%" }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.4 }}
      />
    </Button>
  </motion.div>
))
SaveReportButton.displayName = "SaveReportButton"

// Мемоизированный компонент для пустого состояния результатов
const EmptyResults = memo(() => (
  <motion.div
    className="flex items-center justify-center h-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <div className="text-center">
      <div className="relative">
        <svg
          className="w-16 h-16 mx-auto text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
          />
        </svg>
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="h-16 w-16 rounded-full bg-emerald-500 filter blur-xl opacity-10 mx-auto"></div>
        </motion.div>
      </div>
      <h3 className="text-lg font-medium text-gray-400 mb-2">Нет результатов</h3>
      <p className="text-gray-500 max-w-md">
        Настройте параметры симуляции и нажмите "Запустить симуляцию", чтобы увидеть результаты.
      </p>
    </div>
  </motion.div>
))
EmptyResults.displayName = "EmptyResults"

// Основной компонент страницы симуляции
const SimulationPage = () => {
  const { simulationId } = useParams<{ simulationId: string }>()
  const navigate = useNavigate()

  // Все состояния объявляем в начале компонента
  const [parameters, setParameters] = useState<Record<string, any>>({})
  const [results, setResults] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [isResultsExpanded, setIsResultsExpanded] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState({
    percentage: 0,
    status: "",
  })
  const [currentSimulationId, setCurrentSimulationId] = useState<string | null>(null)
  const [useServerSimulation, setUseServerSimulation] = useState(false)
  const [useWorkerSimulation, setUseWorkerSimulation] = useState(true)
  const [simulationNotFound, setSimulationNotFound] = useState(false)
  const [simulation, setSimulation] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Новые состояния для управления отчетами
  const [isReportManagerOpen, setIsReportManagerOpen] = useState(false)
  const chartRefs = useRef<React.RefObject<HTMLDivElement>[]>([])

  // Мемоизируем режим симуляции, чтобы избежать лишних вычислений
  const simulationMode = useMemo(() => {
    if (useServerSimulation) return "server"
    if (useWorkerSimulation) return "worker"
    return "local"
  }, [useServerSimulation, useWorkerSimulation])

  // Получаем симуляцию при загрузке страницы
  useEffect(() => {
    console.log("SimulationPage: Получение симуляции с ID:", simulationId)
    setLoading(true)

    if (!simulationId) {
      console.error("SimulationPage: ID симуляции не указан")
      setSimulationNotFound(true)
      setLoading(false)
      return
    }

    try {
      // Получаем симуляцию из реестра
      const sim = simulationRegistry.getSimulation(simulationId)
      console.log("SimulationPage: Найдена симуляция:", sim)

      if (sim) {
        setSimulation(sim)
        setParameters(sim.defaultParameters || {})
        setDebugInfo("")
        setSimulationNotFound(false)
      } else {
        console.error("SimulationPage: Симуляция не найдена:", simulationId)
        setDebugInfo(`Симуляция не найдена: ${simulationId}`)
        setSimulationNotFound(true)
      }
    } catch (error) {
      console.error("Ошибка при загрузке симуляции:", error)
      setDebugInfo(`Ошибка: ${error}`)
      setSimulationNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [simulationId])

  // Определяем все колбэки с useCallback
  const handleRunSimulation = useCallback(async () => {
    if (!simulation) return

    setIsRunning(true)
    setResults(null)
    setSimulationProgress({
      percentage: 0,
      status: "Подготовка симуляции...",
    })

    try {
      // Генерируем ID для текущей симуляции
      const simulationId = Date.now().toString()
      setCurrentSimulationId(simulationId)

      console.log(`Запуск симуляции в режиме: ${simulationMode}`)

      // Запускаем симуляцию через сервис
      const results = await simulationService.runSimulation(simulation.id, parameters, {
        useServer: useServerSimulation,
        useWorker: useWorkerSimulation,
        onProgress: (progress) => {
          setSimulationProgress(progress)
        },
        onComplete: (results) => {
          setResults(results)
          setIsRunning(false)
          setSimulationProgress({
            percentage: 100,
            status: "Симуляция завершена",
          })
        },
        onError: (error) => {
          console.error("Ошибка симуляции:", error)
          setIsRunning(false)
          setSimulationProgress({
            percentage: 0,
            status: `Ошибка: ${error}`,
          })
        },
      })

      setResults(results)
    } catch (error) {
      console.error("Ошибка при выполнении симуляции:", error)
    } finally {
      setIsRunning(false)
    }
  }, [parameters, simulation, simulationMode, useServerSimulation, useWorkerSimulation])

  const handleCancelSimulation = useCallback(async () => {
    if (currentSimulationId) {
      await simulationService.cancelSimulation(currentSimulationId, useServerSimulation)
      setIsRunning(false)
      setSimulationProgress({
        percentage: 0,
        status: "Симуляция отменена",
      })
    }
  }, [currentSimulationId, useServerSimulation])

  // Функция для открытия менеджера отчетов
  const handleOpenReportManager = useCallback(() => {
    setIsReportManagerOpen(true)
  }, [])

  // Функция для регистрации ref графика
  const registerChartRef = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    if (ref && !chartRefs.current.includes(ref)) {
      chartRefs.current.push(ref)
    }
    return ref
  }, [])

  // Показываем загрузку
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <LoadingSpinner size="large" />
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500 filter blur-xl opacity-30 mx-auto"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Показываем ошибку, если симуляция не найдена
  if (simulationNotFound) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <motion.div
          className="text-center max-w-md w-full px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-red-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Симуляция не найдена</h2>
          <p className="text-gray-400 mb-6">Запрошенный тип симуляции не существует.</p>
          <pre className="mb-4 p-2 bg-gray-800 text-gray-300 text-xs rounded overflow-auto max-w-md mx-auto">
            {debugInfo || `ID: ${simulationId}`}
          </pre>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
          >
            Вернуться на главную
          </Button>
        </motion.div>
      </div>
    )
  }

  // Показываем ошибку, если симуляция не загружена
  if (!simulation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <motion.div
          className="text-center max-w-md w-full px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Ошибка загрузки симуляции</h2>
          <p className="text-gray-400 mb-6">Не удалось загрузить данные симуляции.</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
          >
            Вернуться на главную
          </Button>
        </motion.div>
      </div>
    )
  }

  // Получаем компоненты из симуляции
  const ParametersForm = simulation.components?.ParametersForm
  const ResultsPanel = simulation.components?.ResultsPanel

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <SimulationHeader simulation={simulation} />

      <div className="flex flex-1 overflow-hidden">
        {/* Панель параметров */}
        <ParametersPanel
          isPanelCollapsed={isPanelCollapsed}
          setIsPanelCollapsed={setIsPanelCollapsed}
          ParametersForm={ParametersForm}
          parameters={parameters}
          setParameters={setParameters}
          handleRunSimulation={handleRunSimulation}
          isRunning={isRunning}
          useWorkerSimulation={useWorkerSimulation}
          setUseWorkerSimulation={setUseWorkerSimulation}
          useServerSimulation={useServerSimulation}
          setUseServerSimulation={setUseServerSimulation}
          registerChartRef={registerChartRef}
        />

        {/* Панель результатов */}
        <motion.div
          className="flex-1 flex flex-col bg-gray-900 overflow-hidden relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Декоративный фон для панели результатов */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
          </div>

          {/* Прогресс-бар симуляции */}
          {isRunning && (
            <SimulationProgress
              simulationProgress={simulationProgress}
              handleCancelSimulation={handleCancelSimulation}
              simulationMode={simulationMode}
            />
          )}

          <div
            className={`flex-1 overflow-y-auto ${
              isResultsExpanded ? "h-full" : "h-2/3"
            } transition-all duration-300 relative z-10`}
          >
            <div className="p-4">
              {results ? (
                <>
                  {/* Кнопка для сохранения отчета */}
                  <SaveReportButton handleOpenReportManager={handleOpenReportManager} />

                  {ResultsPanel ? (
                    <ResultsPanel
                      results={results}
                      parameters={parameters}
                      isLive={isRunning}
                      registerChartRef={registerChartRef}
                    />
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-red-400">Ошибка: Компонент результатов не найден</p>
                    </div>
                  )}
                </>
              ) : (
                <EmptyResults />
              )}
            </div>
          </div>

          {/* Кнопка для переключения режима отображения результатов */}
          {results && (
            <motion.button
              onClick={() => setIsResultsExpanded(!isResultsExpanded)}
              className="p-2 bg-gray-800 border-t border-gray-700 text-gray-400 hover:text-white flex items-center justify-center relative z-10 group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {isResultsExpanded ? (
                <>
                  <span className="mr-2">Свернуть детали</span>
                  <ChevronRight className="rotate-90 group-hover:translate-y-1 transition-transform" size={16} />
                </>
              ) : (
                <>
                  <span className="mr-2">Развернуть детали</span>
                  <ChevronRight className="-rotate-90 group-hover:-translate-y-1 transition-transform" size={16} />
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Менеджер отчетов */}
      {isReportManagerOpen && (
        <ReportManager
          isOpen={isReportManagerOpen}
          onClose={() => setIsReportManagerOpen(false)}
          simulationType={simulation.id}
          parameters={parameters}
          results={results}
          chartRefs={chartRefs.current}
        />
      )}
    </div>
  )
}

export default SimulationPage
