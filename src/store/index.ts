import { configureStore } from "@reduxjs/toolkit"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import simulationReducer from "./slices/simulationSlice"

export const store = configureStore({
  reducer: {
    simulation: simulationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем некоторые пути для функций и сложных объектов
        ignoredActions: ["simulation/setResults"],
        ignoredPaths: [],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Типизированные хуки для использования в компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
