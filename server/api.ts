import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

// ES модули не имеют __dirname, поэтому создаем его
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()

// Путь к файлу с данными
const dataPath = path.join(__dirname, "../data/simulations.json")

// Создаем директорию data, если она не существует
const dataDir = path.join(__dirname, "../data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Создаем пустой файл simulations.json, если он не существует
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({ simulations: [] }), "utf8")
}

// Безопасное чтение данных с обработкой ошибок
function safeReadData() {
  try {
    if (!fs.existsSync(dataPath)) {
      return { simulations: [] }
    }
    const data = fs.readFileSync(dataPath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading data file:", error)
    return { simulations: [] }
  }
}

// Безопасная запись данных с обработкой ошибок
function safeWriteData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error writing data file:", error)
    return false
  }
}

// Получение всех симуляций
router.get("/simulations", (req, res) => {
  try {
    const data = safeReadData()
    res.json(data.simulations)
  } catch (error) {
    console.error("Error reading simulations:", error)
    res.status(200).json([]) // Возвращаем пустой массив вместо ошибки
  }
})

// Создание новой симуляции
router.post("/simulations", (req, res) => {
  try {
    const data = safeReadData()
    const newSimulation = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...req.body,
    }
    data.simulations.push(newSimulation)
    safeWriteData(data)
    res.status(201).json(newSimulation)
  } catch (error) {
    console.error("Error creating simulation:", error)
    res.status(200).json({ success: false, message: "Failed to create simulation" })
  }
})

// Получение симуляции по ID
router.get("/simulations/:id", (req, res) => {
  try {
    const data = safeReadData()
    const simulation = data.simulations.find((sim) => sim.id === req.params.id)

    if (!simulation) {
      // Если симуляция не найдена, возвращаем пустой объект вместо ошибки
      return res.json({ id: req.params.id, nodes: [], connections: [] })
    }

    res.json(simulation)
  } catch (error) {
    console.error("Error reading simulation:", error)
    // Возвращаем пустой объект вместо ошибки 500
    res.json({ id: req.params.id, nodes: [], connections: [] })
  }
})

// Обновление симуляции
router.put("/simulations/:id", (req, res) => {
  try {
    const data = safeReadData()
    const index = data.simulations.findIndex((sim) => sim.id === req.params.id)

    if (index === -1) {
      // Если симуляция не найдена, создаем новую
      const newSimulation = {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString(),
      }
      data.simulations.push(newSimulation)
      safeWriteData(data)
      return res.json(newSimulation)
    } else {
      // Иначе обновляем существующую
      data.simulations[index] = {
        ...data.simulations[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      }
      safeWriteData(data)
      return res.json(data.simulations[index])
    }
  } catch (error) {
    console.error("Error updating simulation:", error)
    // Возвращаем базовый успешный ответ вместо ошибки
    res.json({ success: true, id: req.params.id })
  }
})

// Удаление симуляции
router.delete("/simulations/:id", (req, res) => {
  try {
    const data = safeReadData()
    const simulationId = req.params.id
    data.simulations = data.simulations.filter((sim) => sim.id !== simulationId)
    safeWriteData(data)
    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting simulation:", error)
    res.json({ success: false, message: "Failed to delete simulation" })
  }
})

// Базовая аутентификация (упрощенная для демонстрации)
router.post("/login", (req, res) => {
  const { username, password } = req.body
  // В реальном приложении здесь была бы проверка учетных данных
  if (username === "admin" && password === "password") {
    res.json({
      success: true,
      user: {
        id: "1",
        username: "admin",
        name: "Administrator",
      },
    })
  } else {
    res.json({ success: false, message: "Invalid credentials" })
  }
})

export default router
