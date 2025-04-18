import { characterCostSimulation } from "@/simulations/characterCost"

import type { Simulation } from "@/types"

class ModuleRegistry {
  private modules: Map<string, Simulation> = new Map()

  registerModule(module: Simulation): void {
    this.modules.set(module.id, module)
  }

  getModule(id: string): Simulation | undefined {
    return this.modules.get(id)
  }

  getAllModules(): Simulation[] {
    return Array.from(this.modules.values())
  }
}

// Create a single instance of the registry
const registry = new ModuleRegistry()

// Register the modules
registry.registerModule(characterCostSimulation)

export { registry }
