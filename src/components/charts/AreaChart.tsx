"use client"

import type React from "react"

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartTooltip } from "../ui/chart"

interface AreaChartProps {
  data: any[]
  xKey: string
  yKeys: { key: string; color: string; name?: string; fillOpacity?: number }[]
  title?: string
  height?: number
  stacked?: boolean
  syncId?: string
}

const AreaChart: React.FC<AreaChartProps> = ({ data, xKey, yKeys, title, height = 300, stacked = false, syncId }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
      {title && <h3 className="text-lg font-medium text-gray-200 mb-4">{title}</h3>}

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} syncId={syncId} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xKey} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<ChartTooltip />} />
            <Legend />

            {yKeys.map((y) => (
              <Area
                key={y.key}
                type="monotone"
                dataKey={y.key}
                name={y.name || y.key}
                stroke={y.color}
                fill={y.color}
                fillOpacity={y.fillOpacity || 0.3}
                stackId={stacked ? "stack" : undefined}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AreaChart
