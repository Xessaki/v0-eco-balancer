import express from "express"
import { runCharacterCostSimulation } from "../simulations/characterCost"

const router = express.Router()

// Хранилище для активных симуляций
const activeSimulations = new Map()

// Эндпоинт для запуска симуляции
router.post("/start", (req, res) => {
  try {
    const { simulationType, parameters } = req.body

    // Генерируем уникальный ID для симуляции
    const simulationId = Date.now().toString()

    // Инициализируем состояние симуляции
    const simulationState = {
      id: simulationId,
      type: simulationType,
      parameters,
      status: "pending",
      progress: 0,
      results: null,
      startTime: Date.now(),
      error: null,
    }

    // Сохраняем состояние симуляции
    activeSimulations.set(simulationId, simulationState)

    // Запускаем симуляцию в отдельном потоке
    setTimeout(() => {
      runSimulation(simulationId, simulationType, parameters)
    }, 0)

    // Возвращаем ID симуляции клиенту
    res.json({ success: true, simulationId })
  } catch (error) {
    console.error("Ошибка при запуске симуляции:", error)
    res.status(500).json({ success: false, error: "Ошибка при запуске симуляции" })
  }
})

// Эндпоинт для проверки статуса симуляции
router.get("/status/:id", (req, res) => {
  try {
    const simulationId = req.params.id
    const simulation = activeSimulations.get(simulationId)

    if (!simulation) {
      return res.status(404).json({ success: false, error: "Симуляция не найдена" })
    }

    // Возвращаем текущий статус симуляции
    res.json({
      success: true,
      status: simulation.status,
      progress: simulation.progress,
      results: simulation.status === "completed" ? simulation.results : null,
      error: simulation.error,
    })
  } catch (error) {
    console.error("Ошибка при получении статуса симуляции:", error)
    res.status(500).json({ success: false, error: "Ошибка при получении статуса симуляции" })
  }
})

// Эндпоинт для отмены симуляции
router.post("/cancel/:id", (req, res) => {
  try {
    const simulationId = req.params.id
    const simulation = activeSimulations.get(simulationId)

    if (!simulation) {
      return res.status(404).json({ success: false, error: "Симуляция не найдена" })
    }

    // Помечаем симуляцию как отмененную
    simulation.status = "cancelled"

    res.json({ success: true })
  } catch (error) {
    console.error("Ошибка при отмене симуляции:", error)
    res.status(500).json({ success: false, error: "Ошибка при отмене симуляции" })
  }
})

// Функция для выполнения симуляции
async function runSimulation(simulationId: string, simulationType: string, parameters: any) {
  const simulation = activeSimulations.get(simulationId)

  if (!simulation || simulation.status === "cancelled") {
    return
  }

  try {
    simulation.status = "running"

    let results

    // Выбираем тип симуляции
    if (simulationType === "characterCost") {
      results = await runCharacterCostSimulation(
        parameters,
        (progress) => {
          simulation.progress = progress.percentage
        },
        () => simulation.status === "cancelled",
      )
    } else {
      throw new Error(`Неизвестный тип симуляции: ${simulationType}`)
    }

    // Обновляем состояние симуляции
    simulation.status = "completed"
    simulation.progress = 100
    simulation.results = results
    simulation.endTime = Date.now()

    // Удаляем симуляцию из активных через некоторое время
    setTimeout(() => {
      activeSimulations.delete(simulationId)
    }, 3600000) // 1 час
  } catch (error) {
    console.error(`Ошибка при выполнении симуляции ${simulationId}:`, error)
    simulation.status = "failed"
    simulation.error = error.message
  }
}

export default router
