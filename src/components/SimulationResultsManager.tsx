"use client"

import type React from "react"
import { useCallback } from "react"
import { ReportManager } from "./ReportManager"
import type { SimulationParameters, SimulationResults } from "@/types"
import html2canvas from "html2canvas"

interface SimulationResultsManagerProps {
  simulationType: string
  parameters: SimulationParameters
  results: SimulationResults
  containerRef?: React.RefObject<HTMLElement>
}

export const SimulationResultsManager: React.FC<SimulationResultsManagerProps> = ({
  simulationType,
  parameters,
  results,
  containerRef,
}) => {
  const captureCharts = useCallback(async () => {
    console.log("Starting chart capture...")
    const charts: Record<string, string> = {}

    try {
      // Определяем контейнер для поиска графиков
      const container = containerRef?.current || document.body
      console.log("Container for chart search:", container)

      // Находим все элементы с атрибутом data-chart-container
      const chartContainers = container.querySelectorAll("[data-chart-container]")
      console.log(`Found ${chartContainers.length} chart containers`)

      // Для каждого контейнера создаем скриншот
      for (let i = 0; i < chartContainers.length; i++) {
        const chartContainer = chartContainers[i] as HTMLElement
        const chartId = chartContainer.getAttribute("data-chart-id") || `chart-${i}`
        const chartTitle = chartContainer.getAttribute("data-chart-title") || `График ${i + 1}`

        console.log(`Capturing chart: ${chartId} - ${chartTitle}`)

        try {
          // Создаем скриншот графика
          const canvas = await html2canvas(chartContainer, {
            scale: 2, // Увеличиваем качество
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
          })

          // Преобразуем canvas в base64 строку
          const imageData = canvas.toDataURL("image/png")

          // Сохраняем изображение в объект charts
          charts[chartId] = {
            title: chartTitle,
            image: imageData,
          }

          console.log(`Chart ${chartId} captured successfully`)
        } catch (error) {
          console.error(`Error capturing chart ${chartId}:`, error)
        }
      }

      console.log(`Captured ${Object.keys(charts).length} charts`)
      return charts
    } catch (error) {
      console.error("Error during chart capture:", error)
      return {}
    }
  }, [containerRef])

  return (
    <ReportManager
      simulationType={simulationType}
      parameters={parameters}
      results={results}
      onCapture={captureCharts}
    />
  )
}

export default SimulationResultsManager
