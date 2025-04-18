"use client"

import type React from "react"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartTooltip } from "../ui/chart"

interface BarChartProps {
  data: any[]
  xKey: string
  yKeys: { key: string; color: string; name?: string }[]
  title?: string
  height?: number
  stacked?: boolean
  colorByValue?: boolean
  syncId?: string
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKeys,
  title,
  height = 300,
  stacked = false,
  colorByValue = false,
  syncId,
}) => {
  // Функция для определения цвета на основе значения
  const getBarColor = (value: number, baseColor: string) => {
    if (!colorByValue) return baseColor

    // Определяем интенсивность цвета на основе значения
    const maxValue = Math.max(...data.map((item) => item[yKeys[0].key]))
    const minValue = Math.min(...data.map((item) => item[yKeys[0].key]))
    const range = maxValue - minValue

    // Если все значения одинаковые, возвращаем базовый цвет
    if (range === 0) return baseColor

    // Нормализуем значение от 0 до 1
    const normalizedValue = (value - minValue) / range

    // Определяем оттенок цвета
    if (baseColor === "#10b981") {
      // Зеленый
      return `rgba(16, 185, 129, ${0.3 + normalizedValue * 0.7})`
    } else if (baseColor === "#ef4444") {
      // Красный
      return `rgba(239, 68, 68, ${0.3 + normalizedValue * 0.7})`
    } else if (baseColor === "#3b82f6") {
      // Синий
      return `rgba(59, 130, 246, ${0.3 + normalizedValue * 0.7})`
    } else {
      return baseColor
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
      {title && <h3 className="text-lg font-medium text-gray-200 mb-4">{title}</h3>}

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} syncId={syncId} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xKey} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<ChartTooltip />} />
            <Legend />

            {yKeys.map((y, index) => (
              <Bar
                key={y.key}
                dataKey={y.key}
                name={y.name || y.key}
                fill={y.color}
                stackId={stacked ? "stack" : undefined}
              >
                {colorByValue &&
                  data.map((entry, index) => <Cell key={`cell-${index}`} fill={getBarColor(entry[y.key], y.color)} />)}
              </Bar>
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChart
