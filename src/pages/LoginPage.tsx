"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { toast } = useToast()

  // Получаем URL для перенаправления после входа
  const from = new URLSearchParams(location.search).get("from") || "/dashboard"

  // Генерируем случайные частицы для фона
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("Attempting login with:", { username, password })
      await login(username, password)

      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему",
      })

      navigate(from, { replace: true })
    } catch (err: any) {
      console.error("Login error:", err)

      // Показываем более подробную информацию об ошибке
      if (err.response) {
        // Ответ от сервера с ошибкой
        setError(`Ошибка: ${err.response.status} - ${err.response.data?.error || "Неизвестная ошибка"}`)
      } else if (err.request) {
        // Запрос был сделан, но ответ не получен
        setError("Сервер не отвечает. Проверьте, запущен ли сервер API.")
      } else {
        // Что-то пошло не так при настройке запроса
        setError(`Ошибка: ${err.message || "Неизвестная ошибка"}`)
      }

      toast({
        title: "Ошибка входа",
        description: "Неверное имя пользователя или пароль",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Магический декоративный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Градиентные блобы */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Сетка фона */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

        {/* Звездные частицы */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block relative"
          >
            <Sparkles className="h-12 w-12 text-emerald-500 mx-auto" />
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500 filter blur-xl opacity-30 mx-auto"></div>
            </motion.div>
          </motion.div>
          <h1 className="mt-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
            EcoBalancer
          </h1>
          <p className="mt-2 text-gray-400">Инструмент для балансировки игровой экономики</p>
        </div>

        <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <CardHeader>
            <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
              Вход в систему
            </CardTitle>
            <CardDescription className="text-gray-400">
              Введите свои учетные данные для доступа к системе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Имя пользователя
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  placeholder="admin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white relative group overflow-hidden"
                disabled={isLoading}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Вход...
                    </>
                  ) : (
                    "Войти"
                  )}
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400">
              По умолчанию: имя пользователя{" "}
              <span className="font-mono text-emerald-400 bg-gray-700/50 px-1 rounded">admin</span>, пароль{" "}
              <span className="font-mono text-emerald-400 bg-gray-700/50 px-1 rounded">admin123</span>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
