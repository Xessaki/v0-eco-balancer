import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { simulationRegistry } from "./simulations/registry"

// Проверяем доступные симуляции при запуске
console.log("Приложение запускается...")
const simulations = simulationRegistry.getAllSimulations()
console.log("Доступные симуляции:", simulations)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
