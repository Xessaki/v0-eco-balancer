"use client"

import type React from "react"

import { useState } from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts"
import { ChartTooltip } from "../ui/chart"

interface LineChartProps {
  data: any[]
  xKey: string
  yKeys: { key: string; color: string; name?: string }[]
  title?: string
  height?: number
  syncId?: string
  allowZoom?: boolean
}

const LineChart: React.FC<LineChartProps> = ({ data, xKey, yKeys, title, height = 300, syncId, allowZoom = true }) => {
  const [refAreaLeft, setRefAreaLeft] = useState<string | number | null>(null)
  const [refAreaRight, setRefAreaRight] = useState<string | number | null>(null)
  const [zoomDomain, setZoomDomain] = useState<{ x?: [number, number]; y?: [number, number] } | null>(null)

  const handleMouseDown = (e: any) => {
    if (!allowZoom || !e) return
    setRefAreaLeft(e.activeLabel)
  }

  const handleMouseMove = (e: any) => {
    if (!allowZoom || !e || refAreaLeft === null) return
    setRefAreaRight(e.activeLabel)
  }

  const handleMouseUp = () => {
    if (!allowZoom || refAreaLeft === null || refAreaRight === null) {
      setRefAreaLeft(null)
      setRefAreaRight(null)
      return
    }

    // Убедимся, что refAreaLeft и refAreaRight - числа
    const left = Number(refAreaLeft)
    const right = Number(refAreaRight)

    if (left === right || right === null) {
      setRefAreaLeft(null)
      setRefAreaRight(null)
      return
    }

    // Определяем диапазон для зума
    const [min, max] = [Math.min(left, right), Math.max(left, right)]

    setZoomDomain({ x: [min, max] })
    setRefAreaLeft(null)
    setRefAreaRight(null)
  }

  const resetZoom = () => {
    setZoomDomain(null)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-0 shadow-md border border-gray-700 h-full">
      {title && <h3 className="text-lg font-medium text-gray-200 mb-4 px-4 pt-4">{title}</h3>}

      <div className="relative h-full w-full">
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <RechartsLineChart
            data={data}
            syncId={syncId}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey={xKey}
              stroke="#9CA3AF"
              domain={zoomDomain?.x ? zoomDomain.x : ["dataMin", "dataMax"]}
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#4B5563" }}
            />
            <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={{ stroke: "#4B5563" }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} iconSize={10} iconType="circle" />

            {yKeys.map((y) => (
              <Line
                key={y.key}
                type="monotone"
                dataKey={y.key}
                name={y.name || y.key}
                stroke={y.color}
                activeDot={{ r: 6 }}
                dot={{ r: 2 }}
                strokeWidth={2}
              />
            ))}

            {refAreaLeft && refAreaRight && (
              <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#10b981" fillOpacity={0.3} />
            )}
          </RechartsLineChart>
        </ResponsiveContainer>

        {allowZoom && zoomDomain && (
          <button
            onClick={resetZoom}
            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded"
          >
            Сбросить масштаб
          </button>
        )}
      </div>
    </div>
  )
}

export default LineChart
