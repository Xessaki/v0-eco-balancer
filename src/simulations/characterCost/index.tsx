import { User } from "lucide-react"
import CharacterCostParametersForm from "./CharacterCostParametersForm"
import CharacterCostResults from "./CharacterCostResults";
import { runCharacterCostSimulation } from "./simulation"

// Экспортируем объект симуляции
export const characterCostSimulation = {
  id: "characterCost",
  name: "Расчет стоимости персонажа",
  description: "Симуляция затрат на получение персонажа с учетом гарантий и вероятностей",
  icon: User,
  defaultParameters: {
    character: {
      name: "Новый персонаж",
      cards: {
        rare: 100,
        epic: 20,
        legendary: 10,
      },
    },
    pull: {
      cardsPerPull: 10,
      rarityDistribution: {
        rare: 0.8,
        epic: 0.15,
        legendary: 0.05,
      },
    },
    cost: {
      gemsPerPull: 160,
      dollarsPerHundredGems: 0.99,
    },
  },
  components: {
    ParametersForm: CharacterCostParametersForm,
    ResultsPanel: CharacterCostResults,
  },
  run: runCharacterCostSimulation,
}

// Для отладки
console.log("Модуль characterCost загружен:", characterCostSimulation)
