"use client"

import type React from "react"

import {
  ComposedChart as RechartsComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartTooltip } from "../ui/chart"

interface SeriesConfig {
  key: string
  type: "line" | "bar" | "area"
  color: string
  name?: string
  yAxisId?: "left" | "right"
  fillOpacity?: number
}

interface ComposedChartProps {
  data: any[]
  xKey: string
  series: SeriesConfig[]
  title?: string
  height?: number
  syncId?: string
  dualYAxis?: boolean
}

const ComposedChart: React.FC<ComposedChartProps> = ({
  data,
  xKey,
  series,
  title,
  height = 300,
  syncId,
  dualYAxis = false,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
      {title && <h3 className="text-lg font-medium text-gray-200 mb-4">{title}</h3>}

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsComposedChart data={data} syncId={syncId} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xKey} stroke="#9CA3AF" />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            {dualYAxis && <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />}
            <Tooltip content={<ChartTooltip />} />
            <Legend />

            {series.map((s) => {
              const yAxisId = s.yAxisId || "left"

              if (s.type === "line") {
                return (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name || s.key}
                    stroke={s.color}
                    yAxisId={yAxisId}
                    dot={{ r: 3 }}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                )
              } else if (s.type === "bar") {
                return <Bar key={s.key} dataKey={s.key} name={s.name || s.key} fill={s.color} yAxisId={yAxisId} />
              } else if (s.type === "area") {
                return (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name || s.key}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={s.fillOpacity || 0.3}
                    yAxisId={yAxisId}
                  />
                )
              }
              return null
            })}
          </RechartsComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ComposedChart
