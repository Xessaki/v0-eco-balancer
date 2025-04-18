"use client"

import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { simulationRegistry } from "@/simulations/registry"
import { ChevronDown, ChevronRight, Settings, HelpCircle, Home, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const Sidebar = () => {
  const [isSimulationsOpen, setIsSimulationsOpen] = useState(true)
  const location = useLocation()
  const simulations = simulationRegistry.getAllSimulations()

  // Анимация для элементов меню
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="w-64 bg-gray-900 text-gray-300 flex flex-col h-full border-r border-gray-800 relative overflow-hidden">
      {/* Магический фон для сайдбара */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-500/10 to-transparent"></div>
      </div>

      <div className="p-4 border-b border-gray-800 relative z-10">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <Sparkles className="h-6 w-6 text-emerald-500 mr-2" />
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
              <div className="h-6 w-6 rounded-full bg-emerald-500 filter blur-md opacity-30"></div>
            </motion.div>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
            RMG Balancer
          </h1>
        </motion.div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 relative z-10">
        <motion.div custom={0} variants={menuItemVariants} initial="hidden" animate="visible">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-900/50 to-blue-900/30 text-white border-l-2 border-emerald-500"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`
            }
          >
            <Home size={18} className="mr-2" />
            <span>Дашборд</span>
          </NavLink>
        </motion.div>

        <div className="mt-6">
          <motion.div custom={1} variants={menuItemVariants} initial="hidden" animate="visible">
            <div
              className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-400 cursor-pointer hover:text-white"
              onClick={() => setIsSimulationsOpen(!isSimulationsOpen)}
            >
              <span>СИМУЛЯЦИИ</span>
              {isSimulationsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </motion.div>

          {isSimulationsOpen && (
            <div className="mt-1">
              {simulations.map((simulation, index) => (
                <motion.div
                  key={simulation.id}
                  custom={index + 2}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <NavLink
                    to={`/simulation/${simulation.id}`}
                    className={({ isActive }) =>
                      `flex items-center pl-8 pr-4 py-2 text-sm ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-900/50 to-blue-900/30 text-white border-l-2 border-emerald-500"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <div className="mr-2 relative">
                      <simulation.icon size={16} />
                      {location.pathname === `/simulation/${simulation.id}` && (
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <div className="h-4 w-4 rounded-full bg-emerald-500 filter blur-sm opacity-30"></div>
                        </motion.div>
                      )}
                    </div>
                    <span>{simulation.name}</span>
                  </NavLink>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-gray-800 p-4 relative z-10">
        <motion.div custom={simulations.length + 2} variants={menuItemVariants} initial="hidden" animate="visible">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-900/50 to-blue-900/30 text-white border-l-2 border-emerald-500"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`
            }
          >
            <Settings size={18} className="mr-2" />
            <span>Настройки</span>
          </NavLink>
        </motion.div>

        <motion.div custom={simulations.length + 3} variants={menuItemVariants} initial="hidden" animate="visible">
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-900/50 to-blue-900/30 text-white border-l-2 border-emerald-500"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`
            }
          >
            <HelpCircle size={18} className="mr-2" />
            <span>Помощь</span>
          </NavLink>
        </motion.div>
      </div>
    </div>
  )
}

export default Sidebar
