import type * as React from "react"

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    color: string
    dataKey: string
    payload: Record<string, any>
  }>
  label?: string
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-md shadow-lg p-3 text-sm">
      <p className="text-gray-300 font-medium mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color || "#10b981" }} />
            <span className="text-gray-400">{entry.name}: </span>
            <span className="text-gray-200 font-medium ml-1">
              {typeof entry.value === "number"
                ? Number.isInteger(entry.value)
                  ? entry.value
                  : entry.value.toFixed(2)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const ChartLegend: React.FC<{
  payload?: Array<{
    value: string
    color: string
    type?: string
  }>
}> = ({ payload }) => {
  if (!payload || !payload.length) {
    return null
  }

  return (
    <ul className="flex flex-wrap justify-center gap-4 mt-2">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-400 text-sm">{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}
