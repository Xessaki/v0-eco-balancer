import type { ComponentType } from "react"

// Базовый интерфейс для симуляции
export interface Simulation {
  id: string
  name: string
  description: string
  icon: ComponentType<any>
  ParametersForm: ComponentType<{
    onSubmit: (parameters: any) => void
    isSubmitting: boolean
  }>
  ResultsComponent: ComponentType<{
    results: any
  }>
  runSimulation: (parameters: any) => Promise<any>
}

// Интерфейс для реестра симуляций
export interface SimulationRegistry {
  getSimulation: (id: string) => Simulation | undefined
  getAllSimulations: () => Simulation[]
}

// Интерфейс для предмета в гача-пуле
export interface GachaItem {
  id: string
  name: string
  rarity: string
  probability: number
  value: number
}

// Интерфейс для порога системы жалости
export interface PityThreshold {
  rarity: string
  threshold: number
}

// Интерфейс для параметров гача-симуляции
export interface GachaParameters {
  items: GachaItem[]
  pullCount: number
  costPerPull: number
  currency: string
  pitySystem: {
    enabled: boolean
    pityThresholds: PityThreshold[]
    resetOnHigherRarity: boolean
  }
}

// Интерфейс для результатов гача-симуляции
export interface GachaResults {
  totalPulls: number
  totalCost: number
  itemsObtained: Record<string, number>
  itemsByRarity: Record<string, number>
  totalValue: number
  roi: number
  pityActivations: Record<string, number>
  pullsHistory: Array<{
    pull: number
    itemId: string
    itemName: string
    rarity: string
    value: number
    isPity: boolean
  }>
  rarityProbabilities: Record<string, number>
  actualRarityDistribution: Record<string, number>
  itemDetails: Array<{
    id: string
    name: string
    rarity: string
    probability: number
    value: number
    obtained: number
    expectedCount: number
    totalValue: number
  }>
  currency: string
  logs: string[]
}

// Интерфейс для уровня здания
export interface BuildingLevel {
  level: number
  requiredXP: number
  upgradeTime: number
}

// Интерфейс для уровня предмета
export interface ItemLevel {
  level: number
  xpProvided: number
  timeToCreate: number
}

// Интерфейс для распределения предметов
export interface ItemDistribution {
  level: number
  percentage: number
}

// Интерфейс для параметров симуляции улучшения здания
export interface BuildingUpgradeParameters {
  building: {
    name: string
    currentLevel: number
    targetLevel: number
    levels: BuildingLevel[]
  }
  items: {
    maxItemLevel: number
    itemLevels: ItemLevel[]
  }
  mergeRules: {
    strategy: string
    bonusChance: number
  }
  workers: {
    totalWorkers: number
    minItemLevelForWorkers: number
  }
  upgradeStrategy: {
    itemDistribution: ItemDistribution[]
  }
}

// Интерфейс для результатов симуляции улучшения здания
export interface BuildingUpgradeResults {
  totalTimeHours: number
  totalItemsCreated: number
  itemsCreatedByLevel: Record<number, number>
  mergesPerformed: number
  finalBuildingLevel: number
  finalBuildingXP: number
  requiredXP: number
  timeWaitingForWorkers: number
  workersUsed: number
  totalUpgradeTimeHours: number
  workerUsageCount: number // Новое поле для отслеживания количества использований рабочих
  logs: string[]
  chartData: {
    xpOverTime: Array<{
      time: number
      xp: number
      level: number
      itemsCreated: number
      mergesPerformed: number
      workersUsed: number
    }>
    workerUtilization: Array<{
      time: number
      workersUsed: number
      workersIdle: number
    }>
    itemsCreatedOverTime: Array<{
      time: number
      level: number
      count: number
    }>
    buildingUpgradeEvents: Array<{
      time: number
      fromLevel: number
      toLevel: number
      upgradeTimeHours: number
    }>
  }
}
