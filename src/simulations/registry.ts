import type { Simulation } from "../types"
// import { buildingUpgradeSimulation } from "./buildingUpgrade"
import { characterCostSimulation } from "./characterCost"

class SimulationRegistry {
  private simulations: Map<string, Simulation> = new Map()

  constructor() {
    // Регистрируем симуляции при создании реестра
    // this.registerSimulation(buildingUpgradeSimulation)
    this.registerSimulation(characterCostSimulation)
    console.log("Симуляции зарегистрированы:", Array.from(this.simulations.keys()))
  }

  registerSimulation(simulation: Simulation): void {
    console.log(`Регистрация симуляции: ${simulation.id}`, simulation)
    if (!simulation || !simulation.id) {
      console.error("Попытка зарегистрировать недействительную симуляцию:", simulation)
      return
    }
    this.simulations.set(simulation.id, simulation)
  }

  getSimulation(id: string): Simulation | undefined {
    console.log(`Поиск симуляции: ${id}`)
    if (!id) {
      console.error("Попытка получить симуляцию с пустым ID")
      return undefined
    }
    const simulation = this.simulations.get(id)
    console.log(`Результат поиска для ${id}:`, simulation ? "найдена" : "не найдена")
    return simulation
  }

  getAllSimulations(): Simulation[] {
    const simulations = Array.from(this.simulations.values())
    console.log(
      "Получение всех симуляций:",
      simulations.map((s) => s.id),
    )
    return simulations
  }
}

// Создаем экземпляр реестра
const simulationRegistry = new SimulationRegistry()

// Экспортируем реестр
export { simulationRegistry }
