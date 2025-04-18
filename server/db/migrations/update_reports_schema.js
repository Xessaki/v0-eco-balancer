// Миграция для обновления схемы таблицы reports
import { getDb } from "../index.js"

async function updateReportsSchema() {
  const db = await getDb()

  console.log("Starting reports table schema update...")

  try {
    // Проверяем, существует ли таблица reports
    const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='reports'")

    if (!tableExists) {
      console.log("Reports table does not exist, creating it...")

      // Создаем таблицу reports с полем charts
      await db.run(`
        CREATE TABLE reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          simulation_type TEXT NOT NULL,
          parameters TEXT NOT NULL,
          results TEXT NOT NULL,
          charts TEXT,
          is_public INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `)

      console.log("Reports table created successfully!")
      return
    } else {
      console.log("Reports table already exists, checking for charts column...")
    }

    // Проверяем, существует ли колонка charts
    const columns = await db.all("PRAGMA table_info(reports)")
    console.log("Table columns:", columns)

    const hasChartsColumn = columns.some((column) => column.name === "charts")

    if (!hasChartsColumn) {
      console.log("Adding charts column to reports table...")

      // Добавляем колонку charts
      await db.run("ALTER TABLE reports ADD COLUMN charts TEXT")

      console.log("Charts column added successfully!")
    } else {
      console.log("Charts column already exists.")
    }

    console.log("Reports table schema update completed!")
  } catch (error) {
    console.error("Error updating reports schema:", error)
    throw error
  }
}

// Запускаем миграцию
updateReportsSchema()
  .then(() => {
    console.log("Migration completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Migration failed:", error)
    process.exit(1)
  })
