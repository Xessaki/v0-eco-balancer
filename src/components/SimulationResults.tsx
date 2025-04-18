"use client"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Loader2 } from "lucide-react"

interface SimulationResultsProps {
  results: any
  chartData?: any
  ResultComponent?: React.ComponentType<any>
  isSimulating?: boolean
}

const SimulationResults: React.FC<SimulationResultsProps> = ({
  results,
  chartData,
  ResultComponent,
  isSimulating = false,
}) => {
  if (!results && !isSimulating) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 max-w-md">
          <svg
            className="w-12 h-12 mx-auto text-gray-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Нет результатов симуляции</h3>
          <p className="text-gray-400">
            Запустите симуляцию, чтобы увидеть результаты. Результаты будут отображены здесь после завершения симуляции.
          </p>
        </div>
      </div>
    )
  }

  if (isSimulating && !results) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 max-w-md text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Симуляция выполняется</h3>
          <p className="text-gray-400">
            Пожалуйста, подождите. Результаты будут отображены после завершения симуляции.
          </p>
        </div>
      </div>
    )
  }

  // Если есть специальный компонент для отображения результатов, используем его
  if (ResultComponent) {
    return <ResultComponent results={results} chartData={chartData} isLive={isSimulating} />
  }

  // Иначе отображаем результаты в стандартном формате
  return (
    <div className="p-4">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList>
          <TabsTrigger value="summary">Сводка</TabsTrigger>
          <TabsTrigger value="details">Детали</TabsTrigger>
          {chartData && <TabsTrigger value="charts">Графики</TabsTrigger>}
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Результаты симуляции</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results &&
                typeof results === "object" &&
                Object.entries(results)
                  .filter(([key]) => !key.startsWith("_") && key !== "chartData" && key !== "details")
                  .map(([key, value]) => (
                    <div key={key} className="bg-gray-700 rounded-md p-3">
                      <div className="text-sm text-gray-400 mb-1">{key}</div>
                      <div className="font-medium text-gray-200">
                        {typeof value === "number"
                          ? Number.isInteger(value)
                            ? value
                            : value.toFixed(2)
                          : String(value)}
                      </div>
                    </div>
                  ))}
            </div>

            {isSimulating && (
              <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-800 rounded-md">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-emerald-500" />
                  <span className="text-emerald-400 text-sm">Обновление данных в реальном времени</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Детальная информация</h3>

            {results && results.details ? (
              <div className="space-y-4">
                {Object.entries(results.details).map(([key, value]) => (
                  <div key={key} className="bg-gray-700 rounded-md p-3">
                    <div className="text-sm font-medium text-gray-300 mb-2">{key}</div>
                    <pre className="text-xs text-gray-400 overflow-auto max-h-40">{JSON.stringify(value, null, 2)}</pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Детальная информация недоступна</div>
            )}
          </div>
        </TabsContent>

        {chartData && (
          <TabsContent value="charts" className="mt-4">
            <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Графики</h3>

              <div className="text-gray-400 text-sm">
                Графики будут отображены здесь, если они доступны в результатах симуляции.
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default SimulationResults
