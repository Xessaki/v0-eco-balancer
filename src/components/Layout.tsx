"use client"

import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import { motion } from "framer-motion"
import { useState } from "react"

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const location = useLocation()

  // Проверяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === "/"

  // Генерируем случайные частицы для фона
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }))

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Показываем Sidebar только если это не главная страница */}
      {!isHomePage && <Sidebar />}
      <motion.div
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-full">
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

          {/* Основной контент */}
          <div className="relative z-10 h-full overflow-auto">
            <Outlet />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Layout
