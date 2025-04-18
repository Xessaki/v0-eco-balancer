"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import api from "../lib/api"

interface User {
  id: number
  username: string
  name: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Проверяем, авторизован ли пользователь при загрузке
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        console.log("Checking auth status with token:", token)
        const response = await api.get("/auth/user")
        setUser(response.data)
        setError(null)
      } catch (err) {
        console.error("Auth check failed:", err)
        localStorage.removeItem("token")
        setError("Сессия истекла. Пожалуйста, войдите снова.")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Функция для входа в систему
  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Sending login request with:", { username, password })
      const response = await api.post("/auth/login", { username, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      setUser(user)
      return user
    } catch (err: any) {
      console.error("Login error:", err)
      const errorMessage = err.response?.data?.error || "Ошибка при входе в систему"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для выхода из системы
  const logout = async () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
