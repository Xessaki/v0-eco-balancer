import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Путь к директории с базой данных
const DATA_DIR = path.join(__dirname, "../../data")
const DB_PATH = path.join(DATA_DIR, "database.sqlite")

// Создаем директорию для базы данных, если она не существует
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Функция для получения подключения к базе данных
export async function getDb() {
  try {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    })

    console.log(`SQLite database connected successfully at: ${DB_PATH}`)

    // Включаем поддержку внешних ключей
    await db.run("PRAGMA foreign_keys = ON")

    return db
  } catch (error) {
    console.error("Error connecting to SQLite database:", error)
    throw error
  }
}

// Функция для запуска миграций
export async function runMigrations() {
  const db = await getDb()

  try {
    // Создаем таблицу миграций, если она не существует
    await db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Получаем список выполненных миграций
    const executedMigrations = await db.all("SELECT name FROM migrations")
    const executedMigrationNames = executedMigrations.map((m) => m.name)

    // Получаем список файлов миграций
    const migrationsDir = path.join(__dirname, "migrations")
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".js"))
      .sort() // Сортируем файлы по имени

    console.log("Running database migrations...")

    // Выполняем миграции, которые еще не были выполнены
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Running migration: ${file}`)

        try {
          // Импортируем и выполняем миграцию
          const migrationPath = path.join(migrationsDir, file)
          const migration = await import(migrationPath)

          // Если миграция экспортирует функцию, вызываем её
          if (typeof migration.default === "function") {
            await migration.default()
          }

          // Записываем информацию о выполненной миграции
          await db.run("INSERT INTO migrations (name) VALUES (?)", file)

          console.log(`Migration ${file} completed`)
        } catch (error) {
          console.error(`Error running migration ${file}:`, error)
          throw error
        }
      } else {
        console.log(`Migration ${file} already executed, skipping`)
      }
    }

    console.log("All migrations completed")
  } catch (error) {
    console.error("Error running migrations:", error)
    throw error
  }
}

// Инициализация базы данных
export async function initDb() {
  try {
    await runMigrations()
    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization failed:", error)
    throw error
  }
}
