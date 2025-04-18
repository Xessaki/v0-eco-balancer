"use client"

import type React from "react"

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts"
import { useState } from "react"
import { ChartTooltip } from "../ui/chart"

interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  title?: string
  height?: number
  innerRadius?: number
  outerRadius?: number
  activeIndex?: number
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

const PieChart: React.FC<PieChartProps> = ({ data, title, height = 300, innerRadius = 0, outerRadius = 80 }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 15}
          outerRadius={outerRadius + 20}
          fill={fill}
        />
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" fontSize={14}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#999" fontSize={12}>
          {`${value} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-0 shadow-md border border-gray-700 h-full">
      {title && <h3 className="text-lg font-medium text-gray-200 mb-4 px-4 pt-4">{title}</h3>}

      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 20 }}
              iconSize={10}
              iconType="circle"
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PieChart
