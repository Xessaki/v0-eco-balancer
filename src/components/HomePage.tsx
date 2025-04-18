"use client"

import { Link } from "react-router-dom"
import { registry } from "../core/registry/moduleRegistry"
import { useState } from "react"
import { motion } from "framer-motion"

const HomePage = () => {
  const modules = registry.getAllModules()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Простая навигация */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-emerald-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-2 text-xl font-bold text-white">EcoBalancer</span>
          </div>

          {/* Десктопное меню */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-emerald-400 font-medium">
              Главная
            </Link>
            <Link to="/canvas/gacha" className="text-gray-300 hover:text-emerald-400 transition-colors">
              Модули
            </Link>
            <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
              Документация
            </a>
          </nav>

          {/* Мобильное меню */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-emerald-400">
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Мобильное меню выпадающее */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 shadow-lg border-t border-gray-700">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-emerald-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <Link
                to="/canvas/gacha"
                className="block px-3 py-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Модули
              </Link>
              <a
                href="#"
                className="block px-3 py-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Документация
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Основной контент */}
      <main>
        {/* Простой заголовок */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Инструмент для балансировки игровой экономики
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-400 max-w-3xl mx-auto"
            >
              EcoBalancer предоставляет инструменты для моделирования, анализа и оптимизации экономических систем в
              играх.
            </motion.p>
          </div>
        </section>

        {/* Основные функции */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className="text-emerald-500 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Визуальное моделирование</h3>
              <p className="text-gray-400 text-sm">
                Создавайте модели экономических систем с помощью интуитивно понятного визуального редактора.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className="text-emerald-500 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Быстрая симуляция</h3>
              <p className="text-gray-400 text-sm">
                Запускайте симуляции с различными параметрами и мгновенно получайте результаты.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className="text-emerald-500 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Гибкая настройка</h3>
              <p className="text-gray-400 text-sm">
                Настраивайте параметры каждого элемента системы для достижения оптимального баланса.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className="text-emerald-500 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Сохранение результатов</h3>
              <p className="text-gray-400 text-sm">
                Сохраняйте и сравнивайте результаты различных симуляций для принятия обоснованных решений.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Доступные модули */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Доступные модули</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-700 rounded-md text-emerald-500">
                      <module.icon className="h-6 w-6" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium">{module.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 h-12 line-clamp-2">{module.description}</p>
                  <Link
                    to={`/canvas/${module.id}`}
                    className="inline-flex items-center text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    Открыть модуль
                    <svg
                      className="ml-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Призыв к действию */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="md:flex md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Начните работу с EcoBalancer</h2>
                <p className="text-gray-400 mb-4 md:mb-0">
                  Выберите один из доступных модулей и приступайте к балансировке вашей игровой экономики.
                </p>
              </div>
              <Link
                to="/canvas/gacha"
                className="inline-block px-5 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
              >
                Начать работу
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Простой футер */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EcoBalancer. Все права защищены.
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            Для геймдизайнеров от <span className="text-emerald-500">Xessaki</span> и{" "}
            <span className="text-emerald-500">Worldspawn</span> с любовью
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
