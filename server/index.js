// Основной файл сервера с подробным логированием
import express from "express"
import cors from "cors"
import { fileURLToPath } from "url"
import { dirname } from "path"
import dotenv from "dotenv"
import { initDb } from "./db/index.js"
import apiRouter from "./api.js"

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log("Starting server initialization...")

// Загружаем переменные окружения
dotenv.config()
console.log("Environment variables loaded")

// Создаем экземпляр приложения Express
const app = express()
const PORT = process.env.PORT || 3001
console.log(`Server will run on port ${PORT}`)

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Разрешаем запросы с Vite dev server
    credentials: true,
  }),
)
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
console.log("Middleware configured")

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Инициализируем базу данных и запускаем сервер
async function startServer() {
  try {
    console.log("Initializing database...")
    await initDb()
    console.log("Database initialized successfully")

    // Подключаем API маршруты
    app.use("/api", apiRouter)
    console.log("API routes registered")

    // Обработка корневого маршрута
    app.get("/", (req, res) => {
      res.send("EcoBalancer API is running")
    })
    console.log("Root route handler configured")

    // Обработка ошибок
    app.use((err, req, res, next) => {
      console.error("Error in request:", err.stack)
      res.status(500).json({ error: "Internal Server Error" })
    })
    console.log("Error handler configured")

    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`API available at http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error("Error starting server:", error)
  }
}

// Запускаем сервер
console.log("Starting server...")
startServer()
