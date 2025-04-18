// Основной файл API, объединяющий все маршруты
import express from "express"
import authRoutes from "./routes/auth.js"
import reportsRoutes from "./routes/reports.js"
import { authenticateToken } from "./middleware/auth.js"

const router = express.Router()

// Логирование запросов
router.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.path}`)
  next()
})

// Базовый маршрут API для проверки работоспособности
router.get("/", (req, res) => {
  res.json({ message: "API is working" })
})

// Подключаем маршруты аутентификации
router.use("/auth", authRoutes)

// Подключаем маршруты отчетов (требуют аутентификации)
router.use("/reports", reportsRoutes)

// Тестовый защищенный маршрут
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user })
})

export default router
