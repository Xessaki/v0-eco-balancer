import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_in_production"

// Middleware для проверки JWT токена
export function authenticateToken(req, res, next) {
  console.log("Authenticating token...")
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    console.log("No token provided")
    return res.status(401).json({ error: "Unauthorized" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err)
      return res.status(403).json({ error: "Forbidden" })
    }

    console.log("Token verified successfully for user:", user)
    req.user = user
    next()
  })
}

// Функция для создания JWT токена
export function generateToken(payload) {
  console.log("Generating token for payload:", payload)
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}
