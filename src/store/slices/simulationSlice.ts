import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface SimulationState {
  isSimulating: boolean
  simulationComplete: boolean
  simulationMode: "instant" | "animated"
  simulationSpeed: number
  results: any | null
  chartData: any | null
  isSaving: boolean
  savedAt: string | null
}

const initialState: SimulationState = {
  isSimulating: false,
  simulationComplete: false,
  simulationMode: "instant",
  simulationSpeed: 1,
  results: null,
  chartData: null,
  isSaving: false,
  savedAt: null,
}

export const simulationSlice = createSlice({
  name: "simulation",
  initialState,
  reducers: {
    setIsSimulating: (state, action: PayloadAction<boolean>) => {
      state.isSimulating = action.payload
      if (!action.payload) {
        state.simulationComplete = true
      }
    },
    setSimulationComplete: (state, action: PayloadAction<boolean>) => {
      state.simulationComplete = action.payload
    },
    setSimulationMode: (state, action: PayloadAction<"instant" | "animated">) => {
      state.simulationMode = action.payload
    },
    setSimulationSpeed: (state, action: PayloadAction<number>) => {
      state.simulationSpeed = action.payload
    },
    setResults: (state, action: PayloadAction<any>) => {
      state.results = action.payload
    },
    setChartData: (state, action: PayloadAction<any>) => {
      state.chartData = action.payload
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload
    },
    setSavedAt: (state, action: PayloadAction<string | null>) => {
      state.savedAt = action.payload
    },
    resetSimulation: (state) => {
      state.isSimulating = false
      state.simulationComplete = false
      state.results = null
      state.chartData = null
    },
  },
})

export const {
  setIsSimulating,
  setSimulationComplete,
  setSimulationMode,
  setSimulationSpeed,
  setResults,
  setChartData,
  setIsSaving,
  setSavedAt,
  resetSimulation,
} = simulationSlice.actions

export default simulationSlice.reducer
