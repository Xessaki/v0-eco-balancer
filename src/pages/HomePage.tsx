"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Sparkles, Wand2, BookOpen, Compass, Zap, Star } from "lucide-react"

const HomePage = () => {
  // Анимация для частиц
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }))

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white overflow-hidden relative">
      {/* Магический фон с частицами */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

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
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Логотип в верхней части */}
        <div className="flex justify-center pt-6">
          <div className="flex items-center">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-emerald-400 mr-2" />
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
                <div className="h-8 w-8 rounded-full bg-emerald-500 filter blur-xl opacity-30"></div>
              </motion.div>
            </div>
            <span className="text-2xl font-bold text-emerald-400">RMG Balancer</span>
          </div>
        </div>

        {/* Героический заголовок */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <Sparkles className="h-16 w-16 text-emerald-400 mx-auto" />
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
                <div className="h-16 w-16 rounded-full bg-emerald-500 filter blur-xl opacity-30 mx-auto"></div>
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"
          >
            Баланс — это магия
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            RMG Balancer — волшебный инструмент для геймдизайнеров, превращающий сложные расчеты в понятные результаты
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link to="/login" className="group">
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Пора творить магию!
                  <Wand2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </button>
            </Link>
          </motion.div>
        </section>

        {/* Магические возможности */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Волшебные возможности
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-colors duration-300"
            >
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl mb-4 inline-block">
                <BookOpen className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Магические формулы</h3>
              <p className="text-gray-400">
                Превращаем сложные игровые формулы в понятные результаты без лишних усилий
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors duration-300"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl mb-4 inline-block">
                <Compass className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Предсказание будущего</h3>
              <p className="text-gray-400">
                Симулируйте тысячи игровых сценариев за секунды и предвидьте результаты ваших решений
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-colors duration-300"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl mb-4 inline-block">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Мгновенные результаты</h3>
              <p className="text-gray-400">
                Получайте результаты мгновенно, как по взмаху волшебной палочки, без долгого ожидания
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-amber-500/50 transition-colors duration-300"
            >
              <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-xl mb-4 inline-block">
                <Star className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Волшебная визуализация</h3>
              <p className="text-gray-400">
                Превращайте сухие цифры в красочные графики и диаграммы, раскрывающие суть данных
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Футер - вынесен за пределы main */}
      <footer className="w-full bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 py-6 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-3">
              <Sparkles className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-lg font-semibold text-white">RMG Balancer</span>
            </div>
            <p className="text-center text-sm text-gray-400 mb-2">
              &copy; {new Date().getFullYear()} RMG Balancer. Создано для геймдизайнеров
            </p>
            <p className="text-center text-xs text-gray-500">
              Сделано трудолюбивыми гномиками <span className="text-emerald-400">Xessar</span> и{" "}
              <span className="text-emerald-400">Worldspawn</span> в подземных мастерских 🛠️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
