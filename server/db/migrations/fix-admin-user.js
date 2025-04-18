// Миграция для исправления пользователя admin
import { getDb } from "../index.js"
import bcrypt from "bcryptjs"

async function fixAdminUser() {
  try {
    console.log("Starting fix-admin-user migration...")
    const db = await getDb()

    // Проверяем, существует ли пользователь admin
    const admin = await db.get("SELECT * FROM users WHERE username = 'admin'")

    if (admin) {
      console.log("Admin user exists, updating password...")
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await db.run("UPDATE users SET password = ? WHERE username = 'admin'", [hashedPassword])
      console.log("Admin password updated successfully")
      console.log("Password hash:", hashedPassword)
    } else {
      console.log("Admin user does not exist, creating new admin user...")
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await db.run("INSERT INTO users (username, password, name, role) VALUES ('admin', ?, 'Administrator', 'admin')", [
        hashedPassword,
      ])
      console.log("Admin user created successfully")
      console.log("Password hash:", hashedPassword)
    }

    console.log("fix-admin-user migration completed successfully")
  } catch (error) {
    console.error("Error in fix-admin-user migration:", error)
    throw error
  }
}

export default fixAdminUser
