import axios from "axios"

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Добавляем интерцепторы для логирования запросов и ответов
api.interceptors.request.use(
  (config) => {
    // Добавляем токен авторизации к каждому запросу, если он есть
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
    return config
  },
  (error) => {
    console.error("API Request Error:", error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error("API Response Error:", error.response || error)
    return Promise.reject(error)
  },
)

// Функции для работы с API

// Аутентификация
export const login = async (username: string, password: string) => {
  try {
    console.log("Sending login request with:", { username, password })
    const response = await api.post("/auth/login", { username, password })
    const { token, user } = response.data

    // Сохраняем токен в localStorage
    localStorage.setItem("token", token)

    return { token, user }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem("token")
}

export const checkAuth = async () => {
  try {
    const response = await api.get("/auth/user")
    return response.data
  } catch (error) {
    console.error("Check auth error:", error)
    throw error
  }
}

// Отчеты
export const getReports = async () => {
  try {
    const response = await api.get("/reports")
    return response.data
  } catch (error) {
    console.error("Get reports error:", error)
    throw error
  }
}

export const getReport = async (reportId: string) => {
  try {
    const response = await api.get(`/reports/${reportId}`)
    return response.data
  } catch (error) {
    console.error(`Get report ${reportId} error:`, error)
    throw error
  }
}

export const saveReport = async (reportData: any) => {
  try {
    const response = await api.post("/reports", reportData)
    return response.data
  } catch (error) {
    console.error("Save report error:", error)
    throw error
  }
}

export const updateReport = async (reportId: string, reportData: any) => {
  try {
    const response = await api.put(`/reports/${reportId}`, reportData)
    return response.data
  } catch (error) {
    console.error(`Update report ${reportId} error:`, error)
    throw error
  }
}

export const deleteReport = async (reportId: string) => {
  try {
    const response = await api.delete(`/reports/${reportId}`)
    return response.data
  } catch (error) {
    console.error(`Delete report ${reportId} error:`, error)
    throw error
  }
}

// Симуляции
export const runSimulation = async (simulationType: string, parameters: any) => {
  try {
    const response = await api.post("/simulations/run", {
      type: simulationType,
      parameters,
    })
    return response.data
  } catch (error) {
    console.error("Run simulation error:", error)
    throw error
  }
}

export default api
