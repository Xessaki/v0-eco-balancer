import type React from "react"

// Интерфейс для параметров симуляции
export interface SimulationParameters {
  [key: string]: any
}

// Интерфейс для результатов симуляции
export interface SimulationResults {
  [key: string]: any
}

// Интерфейс для компонентов симуляции
export interface SimulationComponents {
  ParametersForm: React.ComponentType<{
    parameters: SimulationParameters
    onChange: (parameters: SimulationParameters) => void
    onRun: () => void
    isRunning: boolean
  }>
  ResultsPanel: React.ComponentType<{
    results: SimulationResults
    isLive?: boolean
  }>
}

// Интерфейс для объекта симуляции
export interface Simulation {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  defaultParameters: SimulationParameters
  components: SimulationComponents
  run: (parameters: SimulationParameters) => Promise<SimulationResults>
}

// Интерфейс для опций запуска симуляции
export interface SimulationRunOptions {
  useServer?: boolean
  useWorker?: boolean
  onProgress?: (progress: { percentage: number; status: string }) => void
  onComplete?: (results: SimulationResults) => void
  onError?: (error: any) => void
}

// Интерфейс для отчета о симуляции
export interface SimulationReport {
  id: string
  name: string
  simulationType: string
  parameters: SimulationParameters
  results: SimulationResults
  createdAt: string
  userId: string
}

// Интерфейс для пользователя
export interface User {
  id: string
  username: string
  email: string
  role: string
}

// Интерфейс для контекста аутентификации
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

// Интерфейс для параметров симуляции CharacterCost
export interface CharacterCostParameters {
  character: {
    name: string
    cards: {
      rare: number
      epic: number
      legendary: number
    }
  }
  pull: {
    cardsPerPull: number
    rarityDistribution: {
      rare: number
      epic: number
      legendary: number
    }
  }
  cost: {
    gemsPerPull: number
    dollarsPerHundredGems: number
  }
}

// Интерфейс для результатов симуляции CharacterCost
export interface CharacterCostResults {
  totalPulls: number
  totalGems: number
  totalDollars: number
  cardsObtained: {
    rare: number
    epic: number
    legendary: number
  }
  extraCards: {
    rare: number
    epic: number
    legendary: number
  }
  pullsHistory: Array<{
    pull: number
    rarity: string
    isNeeded: boolean
  }>
  chartData: {
    progressOverTime: Array<{
      pull: number
      rareProgress: number
      epicProgress: number
      legendaryProgress: number
      gemsSpent: number
    }>
    cardDistribution: {
      rare: number
      epic: number
      legendary: number
    }
  }
  logs: string[]
}
