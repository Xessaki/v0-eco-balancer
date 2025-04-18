// Скрипт для сброса пароля администратора
import { getDb } from "../server/db/index.js"
import bcrypt from "bcryptjs"

async function resetAdminPassword() {
  try {
    console.log("Connecting to database...")
    const db = await getDb()

    console.log("Checking if admin user exists...")
    const admin = await db.get("SELECT * FROM users WHERE username = 'admin'")

    const newPassword = "admin123"
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    if (admin) {
      console.log("Admin user found, resetting password...")
      await db.run("UPDATE users SET password = ? WHERE username = 'admin'", [hashedPassword])
      console.log("Admin password reset successfully")
      console.log(`Username: admin, Password: ${newPassword}`)
    } else {
      console.log("Admin user not found, creating new admin user...")
      await db.run("INSERT INTO users (username, password, name, role) VALUES ('admin', ?, 'Administrator', 'admin')", [
        hashedPassword,
      ])
      console.log("Admin user created successfully")
      console.log(`Username: admin, Password: ${newPassword}`)
    }

    // Выводим хеш пароля для отладки
    console.log("Password hash:", hashedPassword)

    process.exit(0)
  } catch (error) {
    console.error("Error resetting admin password:", error)
    process.exit(1)
  }
}

resetAdminPassword()
