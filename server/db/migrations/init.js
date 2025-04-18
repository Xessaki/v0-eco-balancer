// Обновляем миграцию для добавления поля charts в таблицу reports
import { fileURLToPath } from "url"
import { dirname } from "path"
import path from "path"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import bcrypt from "bcryptjs"
import fs from "fs"

// ES modules don't have __dirname, so we create it
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Ensure the data directory exists
const dataDir = path.join(__dirname, "../../../data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "database.sqlite")

async function initializeDatabase() {
  try {
    // Open the database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        email TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Create reports table with charts field
    await db.exec(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        simulation_type TEXT NOT NULL,
        parameters TEXT NOT NULL,
        results TEXT NOT NULL,
        charts TEXT,
        is_public INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `)

    // Check if admin user exists
    const adminExists = await db.get("SELECT * FROM users WHERE username = 'admin'")

    // If admin doesn't exist, create it
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await db.run(
        `INSERT INTO users (username, password, name, role)
         VALUES ('admin', ?, 'Administrator', 'admin')`,
        [hashedPassword],
      )
      console.log("Admin user created successfully")
    }

    console.log("Database initialized successfully")
    return db
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// Экспортируем функцию для использования в системе миграций
export default initializeDatabase
