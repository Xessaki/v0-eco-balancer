// src/components/SimulationPage.tsx

import type React from "react"

// Исправляем стили для панели параметров
const parametersPanelStyles = "bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300"

// Исправляем стили для панели результатов
const resultsPanelStyles = "flex-1 flex flex-col bg-gray-900 overflow-hidden relative"

// Исправляем стили для прогресс-бара
const progressBarStyles = "h-2 bg-gray-700"

const SimulationPage: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Parameters Panel */}
      <div className={parametersPanelStyles} style={{ width: "300px" }}>
        <h2 className="text-lg text-white p-4">Parameters</h2>
        {/* Add parameter input components here */}
      </div>

      {/* Results Panel */}
      <div className={resultsPanelStyles}>
        {/* Progress Bar */}
        <div className={progressBarStyles}>{/* Progress indicator */}</div>

        {/* Simulation Results */}
        <div className="p-4 text-white">
          <h2>Simulation Results</h2>
          {/* Display simulation results here */}
        </div>
      </div>
    </div>
  )
}

export default SimulationPage
