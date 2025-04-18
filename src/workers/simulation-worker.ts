// Web Worker для выполнения симуляции в отдельном потоке

// Импортируем функции симуляции
import { runCharacterCostSimulation } from "../simulations/characterCost/simulation"

// Обработчик сообщений
self.onmessage = async (event) => {
  const { type, simulationType, parameters, simulationId } = event.data

  if (type === "start") {
    try {
      // Отправляем сообщение о начале симуляции
      self.postMessage({
        type: "status",
        simulationId,
        status: "running",
        progress: 0,
      })

      // Выбираем тип симуляции
      let results

      if (simulationType === "characterCost") {
        results = await runCharacterCostSimulation(
          parameters,
          (progress) => {
            // Отправляем обно��ление прогресса
            self.postMessage({
              type: "progress",
              simulationId,
              progress: progress.percentage,
            })
          },
          () => false, // Web Worker не поддерживает отмену
        )
      } else {
        throw new Error(`Неизвестный тип симуляции: ${simulationType}`)
      }

      // Отправляем результаты
      self.postMessage({
        type: "complete",
        simulationId,
        results,
      })
    } catch (error) {
      // Отправляем ошибку
      self.postMessage({
        type: "error",
        simulationId,
        error: error.message,
      })
    }
  }
}

// Сообщаем, что Worker готов
self.postMessage({ type: "ready" })
