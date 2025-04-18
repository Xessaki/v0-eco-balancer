import express from "express"
import bcrypt from "bcryptjs"
import { generateToken } from "../middleware/auth.js"
import { getDb } from "../db/index.js"
import jwt from "jsonwebtoken"

const router = express.Router()

// Login route
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body)
    const { username, password } = req.body

    if (!username || !password) {
      console.log("Missing username or password")
      return res.status(400).json({ error: "Username and password are required" })
    }

    console.log("Login attempt for user:", username)

    const db = await getDb()

    // Check if user exists
    const user = await db.get("SELECT * FROM users WHERE username = ?", [username])

    if (!user) {
      console.log("User not found:", username)
      return res.status(401).json({ error: "Invalid username or password" })
    }

    console.log("User found, checking password")
    console.log("Stored password hash:", user.password)
    console.log("Comparing with provided password:", password)

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    console.log("Password valid:", isPasswordValid)

    if (!isPasswordValid) {
      console.log("Invalid password for user:", username)
      return res.status(401).json({ error: "Invalid username or password" })
    }

    console.log("Login successful for user:", username)

    // Create JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    })

    // Send token and user data
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get current user route
router.get("/user", async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      console.log("No token provided for user check")
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_in_production"
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log("Token verified for user check:", decoded)

    const db = await getDb()

    // Get user data from database
    const user = await db.get("SELECT id, username, name, role FROM users WHERE id = ?", [decoded.id])

    if (!user) {
      console.log("User not found for ID:", decoded.id)
      return res.status(404).json({ error: "User not found" })
    }

    console.log("User data retrieved successfully:", user.username)
    res.json(user)
  } catch (error) {
    console.error("Error fetching user data:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
