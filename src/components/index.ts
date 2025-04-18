// Экспортируем все компоненты из одного файла для удобства импорта

export { default as ErrorBoundary } from "./ErrorBoundary"
export { default as SimulationControls } from "./SimulationControls"
export { default as SimulationResults } from "./SimulationResults"
export { default as Layout } from "./Layout"
export { default as Sidebar } from "./Sidebar"

// Экспортируем LoadingSpinner
export { default as LoadingSpinner } from "./ui/loading-spinner"

// UI компоненты
export * from "./ui"
