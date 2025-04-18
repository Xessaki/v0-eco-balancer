"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Suspense, useEffect } from "react"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import DashboardPage from "./pages/DashboardPage"
import SimulationPage from "./pages/SimulationPage"
import LoginPage from "./pages/LoginPage"
import ReportPage from "./pages/ReportPage"
import { AuthProvider } from "./contexts/AuthContext"
import LoadingSpinner from "./components/ui/loading-spinner"
import { simulationRegistry } from "./simulations/registry"

// Проверка доступных симуляций при запуске
const App = () => {
  useEffect(() => {
    // Выводим список доступных симуляций при запуске
    const simulations = simulationRegistry.getAllSimulations()
    console.log("Доступные симуляции в App:", simulations)
  }, [])

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="simulation/:simulationId" element={<SimulationPage />} />
              {/* Убедимся, что маршрут для отчетов правильно определен */}
              {/* Проверим маршрут для отчетов: */}
              <Route path="report/:reportId" element={<ReportPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App
