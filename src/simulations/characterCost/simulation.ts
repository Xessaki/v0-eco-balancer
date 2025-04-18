import type { CharacterCostParameters, CharacterCostResults } from "../../types"

// Функция для выполнения симуляции расчета стоимости персонажа
export async function runCharacterCostSimulation(
  parameters: CharacterCostParameters,
  onProgress?: (progress: { percentage: number; status: string }) => void,
  onCancel?: () => boolean,
): Promise<CharacterCostResults> {
  // Добавляем дополнительное логирование в функцию симуляции
  // В начале функции runCharacterCostSimulation добавляем:
  console.log("Starting character cost simulation with parameters:", parameters)

  // Извлекаем параметры
  const { character, pull, cost } = parameters

  // Инициализируем результаты
  const results: CharacterCostResults = {
    totalPulls: 0,
    totalGems: 0,
    totalDollars: 0,
    cardsObtained: {
      rare: 0,
      epic: 0,
      legendary: 0,
    },
    extraCards: {
      rare: 0,
      epic: 0,
      legendary: 0,
    },
    pullsHistory: [],
    chartData: {
      progressOverTime: [],
      cardDistribution: {
        rare: 0,
        epic: 0,
        legendary: 0,
      },
    },
    logs: [],
  }

  // Функция для добавления лога
  const addLog = (message: string) => {
    console.log(message)
    results.logs.push(message)
  }

  // Начинаем симуляцию
  addLog(`Начало симуляции для персонажа "${character.name}" с использованием весовой системы`)
  addLog(
    `Требуется карточек: Rare - ${character.cards.rare}, Epic - ${character.cards.epic}, Legendary - ${character.cards.legendary}`,
  )
  addLog(`Карточек за одну крутку: ${pull.cardsPerPull}`)

  // Обновляем логику симуляции, чтобы она работала с целыми числами
  // Рассчитываем общую сумму весов для нормализации
  const totalWeight = pull.rarityDistribution.rare + pull.rarityDistribution.epic + pull.rarityDistribution.legendary
  const normalizedRare = (pull.rarityDistribution.rare / totalWeight) * 100
  const normalizedEpic = (pull.rarityDistribution.epic / totalWeight) * 100
  const normalizedLegendary = (pull.rarityDistribution.legendary / totalWeight) * 100

  // Обновляем отображение весов в логах для использования процентов
  addLog(
    `Веса редкостей: Rare - ${normalizedRare.toFixed(2)}%, Epic - ${normalizedEpic.toFixed(2)}%, Legendary - ${normalizedLegendary.toFixed(2)}%`,
  )

  // Максимальное количество круток для предотвращения бесконечного цикла
  const MAX_PULLS = 10000
  let pullCount = 0

  // Текущее количество собранных карточек каждой редкости
  let rareCards = 0
  let epicCards = 0
  let legendaryCards = 0

  // Функция для определения редкости карточки с использованием системы весов
  const getCardRarity = (): "rare" | "epic" | "legendary" => {
    const random = Math.random() * totalWeight // Случайное число от 0 до суммы весов

    let cumulativeWeight = 0

    // Проверяем rare
    cumulativeWeight += pull.rarityDistribution.rare
    if (random < cumulativeWeight) return "rare"

    // Проверяем epic
    cumulativeWeight += pull.rarityDistribution.epic
    if (random < cumulativeWeight) return "epic"

    // Если не rare и не epic, то legendary
    return "legendary"
  }

  // Выполняем крутки, пока не соберем все карточки или не достигнем максимального количества круток
  while (
    (rareCards < character.cards.rare ||
      epicCards < character.cards.epic ||
      legendaryCards < character.cards.legendary) &&
    pullCount < MAX_PULLS
  ) {
    // Проверяем отмену
    if (onCancel && onCancel()) {
      addLog("Симуляция была отменена пользователем")
      break
    }

    // Увеличиваем счетчик круток
    pullCount++

    // Обновляем финансовые показатели
    results.totalPulls = pullCount
    results.totalGems = pullCount * cost.gemsPerPull
    results.totalDollars = (results.totalGems / 100) * cost.dollarsPerHundredGems

    // Счетчики карточек для текущей крутки (для логирования)
    let currentPullRare = 0
    let currentPullEpic = 0
    let currentPullLegendary = 0

    // Для каждой карточки в крутке определяем её редкость с помощью системы весов
    for (let i = 0; i < pull.cardsPerPull; i++) {
      const rarity = getCardRarity()

      // Обрабатываем карточку в зависимости от её редкости
      if (rarity === "rare") {
        results.cardsObtained.rare++
        currentPullRare++

        if (rareCards < character.cards.rare) {
          rareCards++

          // Добавляем запись в историю круток
          results.pullsHistory.push({
            pull: pullCount,
            rarity: "rare",
            isNeeded: true,
          })

          // Проверяем, завершен ли сбор карточек этой редкости
          if (rareCards === character.cards.rare) {
            addLog(`Собраны все карточки редкости Rare (${character.cards.rare}) на крутке ${pullCount}`)
          }
        } else {
          results.extraCards.rare++

          // Добавляем запись в историю круток
          results.pullsHistory.push({
            pull: pullCount,
            rarity: "rare",
            isNeeded: false,
          })
        }
      } else if (rarity === "epic") {
        results.cardsObtained.epic++
        currentPullEpic++

        if (epicCards < character.cards.epic) {
          epicCards++

          // Добавляем запись в историю круток
          results.pullsHistory.push({
            pull: pullCount,
            rarity: "epic",
            isNeeded: true,
          })

          // Проверяем, завершен ли сбор карточек этой редкости
          if (epicCards === character.cards.epic) {
            addLog(`Собраны все карточки редкости Epic (${character.cards.epic}) на крутке ${pullCount}`)
          }
        } else {
          results.extraCards.epic++

          // Добавляем запись в историю круток
          results.pullsHistory.push({
            pull: pullCount,
            rarity: "epic",
            isNeeded: false,
          })
        }
      } else if (rarity === "legendary") {
        results.cardsObtained.legendary++
        currentPullLegendary++

        if (legendaryCards < character.cards.legendary) {
          legendaryCards++

          // Добавляем запись в историю круток
          results.pullsHistory.push({
            pull: pullCount,
            rarity: "legendary",
            isNeeded: true,
          })

          // Проверяем, завершен ли сбор карточек этой редкости
          if (legendaryCards === character.cards.legendary) {
            addLog(`Собраны все карточки редкости Legendary (${character.cards.legendary}) на крутке ${pullCount}`)
          }
        } else {
          results.extraCards.legendary++

          // Добавляем запись в историю круток
          results.pullsHistory.push({
            pull: pullCount,
            rarity: "legendary",
            isNeeded: false,
          })
        }
      }
    }

    // Логируем результаты крутки каждые 50 круток или при получении легендарной карточки
    if (pullCount % 50 === 0 || currentPullLegendary > 0) {
      addLog(
        `Крутка #${pullCount}: Rare - ${currentPullRare}, Epic - ${currentPullEpic}, Legendary - ${currentPullLegendary}`,
      )
    }

    // Добавляем данные для графика прогресса
    results.chartData.progressOverTime.push({
      pull: pullCount,
      rareProgress: Math.min(100, (rareCards / character.cards.rare) * 100),
      epicProgress: Math.min(100, (epicCards / character.cards.epic) * 100),
      legendaryProgress: Math.min(100, (legendaryCards / character.cards.legendary) * 100),
      gemsSpent: results.totalGems,
    })

    // Обновляем прогресс каждые 10 круток
    if (pullCount % 10 === 0 && onProgress) {
      // Рассчитываем общий прогресс как среднее значение прогресса по всем редкостям
      const rareProgress = Math.min(100, (rareCards / character.cards.rare) * 100)
      const epicProgress = Math.min(100, (epicCards / character.cards.epic) * 100)
      const legendaryProgress = Math.min(100, (legendaryCards / character.cards.legendary) * 100)
      const overallProgress = Math.min(95, (rareProgress + epicProgress + legendaryProgress) / 3)

      onProgress({
        percentage: Math.round(overallProgress),
        status: `Выполнено ${pullCount} круток...`,
      })
    }
  }

  // Проверяем, достигли ли мы максимального количества круток
  if (pullCount >= MAX_PULLS) {
    addLog(`Предупреждение: Достигнуто максимальное количество круток (${MAX_PULLS}). Симуляция может быть неполной.`)
  }

  // Обновляем данные для графика распределения карточек
  results.chartData.cardDistribution = {
    rare: results.cardsObtained.rare,
    epic: results.cardsObtained.epic,
    legendary: results.cardsObtained.legendary,
  }

  // Рассчитываем фактическое распределение редкостей
  const totalCards = results.cardsObtained.rare + results.cardsObtained.epic + results.cardsObtained.legendary
  const actualRarePercent = (results.cardsObtained.rare / totalCards) * 100
  const actualEpicPercent = (results.cardsObtained.epic / totalCards) * 100
  const actualLegendaryPercent = (results.cardsObtained.legendary / totalCards) * 100

  // Добавляем итоговую информацию в лог
  addLog(`Симуляция завершена. Выполнено ${pullCount} круток.`)
  addLog(`Потрачено гемов: ${results.totalGems}`)
  addLog(`Потрачено долларов: ${results.totalDollars.toFixed(2)}`)
  addLog(
    `Получено карточек: Rare - ${results.cardsObtained.rare}, Epic - ${results.cardsObtained.epic}, Legendary - ${results.cardsObtained.legendary}`,
  )
  addLog(
    `Лишние карточки: Rare - ${results.extraCards.rare}, Epic - ${results.extraCards.epic}, Legendary - ${results.extraCards.legendary}`,
  )
  addLog(
    `Фактическое распределение редкостей: Rare - ${actualRarePercent.toFixed(2)}%, Epic - ${actualEpicPercent.toFixed(2)}%, Legendary - ${actualLegendaryPercent.toFixed(2)}%`,
  )
  addLog(
    `Ожидаемое распределение редкостей (нормализованные веса): Rare - ${normalizedRare.toFixed(2)}%, Epic - ${normalizedEpic.toFixed(2)}%, Legendary - ${normalizedLegendary.toFixed(2)}%`,
  )

  // Обновляем прогресс до 100%
  if (onProgress) {
    onProgress({
      percentage: 100,
      status: "Симуляция завершена",
    })
  }

  // В конце функции, перед return results, добавляем:
  console.log("Simulation completed with results:", results)

  return results
}
