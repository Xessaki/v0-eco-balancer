// Сервис для работы с API

// Базовый URL API
const API_BASE_URL = "/api"

// Функция для выполнения запросов к API
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}

// API для работы с симуляциями
export const simulationsAPI = {
  // Получение всех симуляций
  getAll: () => fetchAPI("/simulations"),

  // Получение симуляции по ID
  getById: (id: string) => fetchAPI(`/simulations/${id}`),

  // Создание новой симуляции
  create: (data: any) =>
    fetchAPI("/simulations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Обновление симуляции
  update: (id: string, data: any) =>
    fetchAPI(`/simulations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Удаление симуляции
  delete: (id: string) =>
    fetchAPI(`/simulations/${id}`, {
      method: "DELETE",
    }),
}

// API для аутентификации
export const authAPI = {
  // Вход в систему
  login: (username: string, password: string) =>
    fetchAPI("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
}

export default {
  simulations: simulationsAPI,
  auth: authAPI,
}
