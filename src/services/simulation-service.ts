// Сервис для управления симуляциями

// Импортируем только нужные функции симуляции
import { runCharacterCostSimulation } from "../simulations/characterCost/simulation"

// Интерфейс для опций симуляции
interface SimulationOptions {
  useServer?: boolean
  useWorker?: boolean
  onProgress?: (progress: { percentage: number; status: string }) => void
  onComplete?: (results: any) => void
  onError?: (error: string) => void
}

// Класс для управления симуляциями
class SimulationService {
  private activeSimulations: Map<string, { worker?: Worker; cancel: () => void }> = new Map()
  private workerSupported: boolean = typeof Worker !== "undefined"

  constructor() {
    // Проверяем поддержку Web Workers
    if (this.workerSupported) {
      console.log("Web Workers поддерживаются")
    } else {
      console.warn("Web Workers не поддерживаются, будет использоваться основной поток")
    }
  }

  // Метод для запуска симуляции
  async runSimulation(simulationType: string, parameters: any, options: SimulationOptions = {}): Promise<any> {
    const simulationId = Date.now().toString()
    let isCancelled = false

    // Функция для отмены симуляции
    const cancelSimulation = () => {
      isCancelled = true
      const simulation = this.activeSimulations.get(simulationId)
      if (simulation?.worker) {
        simulation.worker.terminate()
      }
      this.activeSimulations.delete(simulationId)
    }

    // Сохраняем функцию отмены
    this.activeSimulations.set(simulationId, { cancel: cancelSimulation })

    try {
      // Определяем режим выполнения симуляции
      if (options.useServer) {
        // Серверная симуляция
        return await this.runServerSimulation(simulationType, parameters, simulationId, options)
      } else if (options.useWorker && this.workerSupported) {
        // Симуляция в Web Worker
        return await this.runWorkerSimulation(simulationType, parameters, simulationId, options)
      } else {
        // Локальная симуляция в основном потоке
        return await this.runLocalSimulation(simulationType, parameters, options)
      }
    } catch (error) {
      if (options.onError) {
        options.onError(error.message || "Неизвестная ошибка")
      }
      throw error
    } finally {
      // Удаляем симуляцию из активных
      if (!options.useServer) {
        this.activeSimulations.delete(simulationId)
      }
    }
  }

  // Метод для отмены симуляции
  cancelSimulation(simulationId: string, isServerSimulation = false): void {
    if (isServerSimulation) {
      // Отмена серверной симуляции через API
      fetch(`/api/simulation/cancel/${simulationId}`, {
        method: "POST",
      }).catch((error) => {
        console.error("Ошибка при отмене серверной симуляции:", error)
      })
    } else {
      // Отмена локальной симуляции
      const simulation = this.activeSimulations.get(simulationId)
      if (simulation) {
        simulation.cancel()
      }
    }
  }

  // Метод для выполнения симуляции на сервере
  private async runServerSimulation(
    simulationType: string,
    parameters: any,
    simulationId: string,
    options: SimulationOptions,
  ): Promise<any> {
    try {
      // Отправляем запрос на запуск симуляции
      const response = await fetch("/api/simulation/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          simulationType,
          parameters,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при запуске симуляции на сервере")
      }

      // Получаем ID симуляции от сервера
      const serverSimulationId = data.simulationId

      // Запускаем опрос статуса симуляции
      return await this.pollServerSimulationStatus(serverSimulationId, options)
    } catch (error) {
      if (options.onError) {
        options.onError(error.message || "Ошибка при запуске серверной симуляции")
      }
      throw error
    }
  }

  // Метод для опроса статуса серверной симуляции
  private async pollServerSimulationStatus(simulationId: string, options: SimulationOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const response = await fetch(`/api/simulation/status/${simulationId}`)
          const data = await response.json()

          if (!data.success) {
            if (options.onError) {
              options.onError(data.error || "Ошибка при получении статуса симуляции")
            }
            reject(new Error(data.error || "Ошибка при получении статуса симуляции"))
            return
          }

          // Обновляем прогресс
          if (options.onProgress) {
            options.onProgress({
              percentage: data.progress,
              status: data.status || "Выполняется...",
            })
          }

          // Проверяем статус симуляции
          if (data.status === "completed") {
            // Симуляция завершена
            if (options.onComplete) {
              options.onComplete(data.results)
            }
            resolve(data.results)
          } else if (data.status === "failed") {
            // Симуляция завершилась с ошибкой
            if (options.onError) {
              options.onError(data.error || "Симуляция завершилась с ошибкой")
            }
            reject(new Error(data.error || "Симуляция завершилась с ошибкой"))
          } else if (data.status === "cancelled") {
            // Симуляция была отменена
            reject(new Error("Симуляция была отменена"))
          } else {
            // Продолжаем опрос
            setTimeout(checkStatus, 1000)
          }
        } catch (error) {
          if (options.onError) {
            options.onError(error.message || "Ошибка при получении статуса симуляции")
          }
          reject(error)
        }
      }

      // Запускаем первую проверку
      checkStatus()
    })
  }

  // Метод для выполнения симуляции в Web Worker
  private async runWorkerSimulation(
    simulationType: string,
    parameters: any,
    simulationId: string,
    options: SimulationOptions,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // Создаем новый Web Worker
        const worker = new Worker(new URL("../workers/simulation-worker.ts", import.meta.url), {
          type: "module",
        })

        // Сохраняем Worker для возможности отмены
        const simulation = this.activeSimulations.get(simulationId)
        if (simulation) {
          simulation.worker = worker
        }

        // Обработчик сообщений от Worker
        worker.onmessage = (event) => {
          const { type, progress, results, error } = event.data

          if (type === "progress" && options.onProgress) {
            // Обновляем прогресс
            options.onProgress({
              percentage: progress,
              status: `Выполнено ${progress}%...`,
            })
          } else if (type === "complete") {
            // Симуляция завершена
            if (options.onComplete) {
              options.onComplete(results)
            }
            worker.terminate()
            resolve(results)
          } else if (type === "error") {
            // Произошла ошибка
            if (options.onError) {
              options.onError(error || "Ошибка в Web Worker")
            }
            worker.terminate()
            reject(new Error(error || "Ошибка в Web Worker"))
          }
        }

        // Обработчик ошибок Worker
        worker.onerror = (error) => {
          if (options.onError) {
            options.onError(error.message || "Ошибка в Web Worker")
          }
          worker.terminate()
          reject(error)
        }

        // Запускаем симуляцию в Worker
        worker.postMessage({
          type: "start",
          simulationType,
          parameters,
          simulationId,
        })
      } catch (error) {
        if (options.onError) {
          options.onError(error.message || "Ошибка при запуске Web Worker")
        }
        reject(error)
      }
    })
  }

  // Метод для выполнения симуляции в основном потоке
  private async runLocalSimulation(simulationType: string, parameters: any, options: SimulationOptions): Promise<any> {
    try {
      let results

      // Выбираем тип симуляции
      if (simulationType === "characterCost") {
        results = await runCharacterCostSimulation(
          parameters,
          (progress) => {
            if (options.onProgress) {
              options.onProgress({
                percentage: progress.percentage,
                status: progress.status || `Выполнено ${progress.percentage}%...`,
              })
            }
          },
          () => false,
        )
      } else {
        throw new Error(`Неизвестный тип симуляции: ${simulationType}`)
      }

      if (options.onComplete) {
        options.onComplete(results)
      }

      console.log("Local simulation completed with results:", results)

      return results
    } catch (error) {
      if (options.onError) {
        options.onError(error.message || "Ошибка при выполнении локальной симуляции")
      }
      throw error
    }
  }

  // Экспортируем экземпляр сервиса
}

// Экспортируем экземпляр сервиса
export const simulationService = new SimulationService()
