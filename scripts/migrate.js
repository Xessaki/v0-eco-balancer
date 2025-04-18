// Скрипт для запуска миграций
const { initializeDatabase } = require("../src/lib/db/migrations/init")

async function runMigrations() {
  try {
    console.log("Starting database migrations...")
    await initializeDatabase()
    console.log("Migrations completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

runMigrations()
