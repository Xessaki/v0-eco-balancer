// Упрощенный файл сервера для запуска только API
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { initDb } from "./db/index.js"
import apiRouter from "./api.js"

// Загружаем переменные окружения
dotenv.config()

// Создаем экземпляр приложения Express
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
)
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Инициализируем базу данных и запускаем сервер
async function startServer() {
  try {
    await initDb()

    // Подключаем API маршруты
    app.use("/api", apiRouter)

    // Обработка корневого маршрута
    app.get("/", (req, res) => {
      res.send("EcoBalancer API is running")
    })

    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Error starting server:", error)
  }
}

// Запускаем сервер
startServer()
