"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { BarChart, LineChart, PieChart, Sparkles, LogOut, Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/lib/api"

interface Report {
  id: number
  title: string
  description: string
  simulation_type: string
  created_at: string
  is_public: boolean
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Генерируем случайные частицы для фона
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }))

  useEffect(() => {
    // Получаем отчеты пользователя
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports")
        setReports(response.data)
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Функция для выхода из системы
  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Функция для удаления отчета
  const handleDeleteReport = async (id: number) => {
    try {
      await api.delete(`/reports/${id}`)
      setReports(reports.filter((report) => report.id !== id))
    } catch (error) {
      console.error("Error deleting report:", error)
    }
  }

  // Анимация для карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <svg
              className="animate-spin h-12 w-12 text-emerald-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500 filter blur-xl opacity-30 mx-auto"></div>
            </motion.div>
          </div>
          <p className="mt-4 text-gray-400">Загрузка данных...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
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

      {/* Верхняя панель */}
      <motion.header
        className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 py-4 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-emerald-500" />
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
                <div className="h-8 w-8 rounded-full bg-emerald-500 filter blur-md opacity-30"></div>
              </motion.div>
            </div>
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
              RMG Balancer
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <motion.div
              className="text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-sm text-gray-300">
                Привет, <span className="text-emerald-400">{user?.name || user?.username}</span>
              </p>
              <p className="text-xs text-gray-400">{user?.role === "admin" ? "Администратор" : "Пользователь"}</p>
            </motion.div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-300 hover:text-white group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                Выйти
              </span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
            Панель управления
          </h1>
          <p className="text-gray-400">Управляйте своими симуляциями и отчетами</p>
        </motion.div>

        <Tabs defaultValue="simulations" className="space-y-6">
          <TabsList className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <TabsTrigger
              value="simulations"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Симуляции
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Сохраненные отчеты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <div className="relative">
                        <BarChart className="h-5 w-5 mr-2 text-emerald-500" />
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.7, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <div className="h-5 w-5 rounded-full bg-emerald-500 filter blur-md opacity-30"></div>
                        </motion.div>
                      </div>
                      Улучшение здания
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Симуляция процесса улучшения здания с учетом мержа предметов
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Моделирование процесса улучшения здания с использованием различных стратегий создания и мержа
                      предметов.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to="/simulation/buildingUpgrade" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 group relative overflow-hidden">
                        <span className="relative z-10 flex items-center">
                          Запустить
                          <motion.div
                            className="ml-2"
                            animate={{
                              x: [0, 2, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            →
                          </motion.div>
                        </span>
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                          initial={{ x: "100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.4 }}
                        />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <div className="relative">
                        <PieChart className="h-5 w-5 mr-2 text-emerald-500" />
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.7, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <div className="h-5 w-5 rounded-full bg-emerald-500 filter blur-md opacity-30"></div>
                        </motion.div>
                      </div>
                      Расчет стоимости персонажа
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Симуляция процесса сбора карточек персонажа
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Расчет стоимости сбора всех необходимых карточек персонажа с учетом вероятностей выпадения.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to="/simulation/characterCost" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 group relative overflow-hidden">
                        <span className="relative z-10 flex items-center">
                          Запустить
                          <motion.div
                            className="ml-2"
                            animate={{
                              x: [0, 2, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            →
                          </motion.div>
                        </span>
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                          initial={{ x: "100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.4 }}
                        />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <div className="relative">
                        <LineChart className="h-5 w-5 mr-2 text-emerald-500" />
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.7, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <div className="h-5 w-5 rounded-full bg-emerald-500 filter blur-md opacity-30"></div>
                        </motion.div>
                      </div>
                      Новая симуляция
                    </CardTitle>
                    <CardDescription className="text-gray-400">Скоро будет доступно</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Новые типы симуляций будут добавлены в ближайшее время. Следите за обновлениями.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300" disabled>
                      <span className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Скоро
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report, index) => (
                  <motion.div key={report.id} custom={index} variants={cardVariants} initial="hidden" animate="visible">
                    <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-white">{report.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {new Date(report.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300 line-clamp-2">{report.description || "Нет описания"}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-900/50 to-blue-900/30 text-emerald-300 border border-emerald-800/50">
                            {report.simulation_type === "buildingUpgrade"
                              ? "Улучшение здания"
                              : report.simulation_type === "characterCost"
                                ? "Расчет стоимости персонажа"
                                : report.simulation_type}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Link to={`/reports/${report.id}`}>
                          <Button
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:text-white hover:border-emerald-500/50 hover:bg-gray-700/50"
                          >
                            Просмотреть
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="text-gray-400 hover:text-white hover:bg-red-900/20"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          Удалить
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative mx-auto w-12 h-12 mb-4">
                  <svg
                    className="h-12 w-12 text-gray-600 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="h-12 w-12 rounded-full bg-emerald-500 filter blur-xl opacity-10 mx-auto"></div>
                  </motion.div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-300">Нет сохраненных отчетов</h3>
                <p className="mt-2 text-gray-400">
                  Запустите симуляцию и сохраните результаты, чтобы они появились здесь.
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
