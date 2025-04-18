import type { CharacterCostParameters, CharacterCostResults } from "./types"

// Кэш для хранения промежуточных результатов
const simulationCache = new Map<string, CharacterCostResults>()

// Функция для генерации ключа кэша на основе параметров
const generateCacheKey = (parameters: CharacterCostParameters): string => {
  return JSON.stringify(parameters)
}

// Функция для добавления случайного отклонения к значению
const addVariation = (value: number, variationPercent: number): number => {
  const variation = (Math.random() * 2 - 1) * variationPercent
  return value * (1 + variation / 100)
}

// Функция для расчета стоимости персонажей
export const calculateCharacterCost = (
  parameters: CharacterCostParameters,
  onProgress?: (progress: { percentage: number; status: string }) => void,
): Promise<CharacterCostResults> => {
  return new Promise((resolve, reject) => {
    try {
      // Проверяем кэш
      const cacheKey = generateCacheKey(parameters)
      if (simulationCache.has(cacheKey)) {
        const cachedResult = simulationCache.get(cacheKey)!

        // Добавляем небольшую вариацию к кэшированным результатам для реалистичности
        const result = {
          ...cachedResult,
          totalCost: addVariation(cachedResult.totalCost, 2),
          budgetEfficiency: addVariation(cachedResult.budgetEfficiency, 5),
          delayRisk: addVariation(cachedResult.delayRisk, 3),
          budgetOverrunRisk: addVariation(cachedResult.budgetOverrunRisk, 3),
        }

        // Имитируем прогресс для кэшированных результатов
        if (onProgress) {
          onProgress({ percentage: 25, status: "Загрузка данных..." })
          setTimeout(() => {
            onProgress({ percentage: 50, status: "Анализ параметров..." })
            setTimeout(() => {
              onProgress({ percentage: 75, status: "Подготовка результатов..." })
              setTimeout(() => {
                onProgress({ percentage: 100, status: "Завершено" })
                resolve(result)
              }, 200)
            }, 200)
          }, 200)
        } else {
          resolve(result)
        }
        return
      }

      // Если результата нет в кэше, выполняем расчеты
      let cancelled = false
      let progress = 0

      // Функция для обновления прогресса
      const updateProgress = (increment: number, status: string) => {
        progress += increment
        if (onProgress) {
          onProgress({ percentage: Math.min(Math.round(progress), 100), status })
        }
      }

      // Запускаем симуляцию в отдельном потоке выполнения
      setTimeout(() => {
        if (cancelled) return

        updateProgress(10, "Инициализация симуляции...")

        // Базовые расчеты
        setTimeout(() => {
          if (cancelled) return

          // Расчет времени на одного персонажа
          const baseModelingTime = parameters.modelingTime * (parameters.highDetailModels ? 1.5 : 1)
          const baseTexturingTime = parameters.texturingTime * (parameters.photoRealisticTextures ? 1.7 : 1)
          const baseRiggingTime = parameters.riggingTime * (parameters.advancedPhysics ? 1.4 : 1)
          const baseAnimationTime = parameters.animationTime

          updateProgress(15, "Расчет базовых параметров...")

          setTimeout(() => {
            if (cancelled) return

            // Расчет общего времени на персонажа
            const complexityFactor = 0.7 + parameters.characterComplexity * 0.06
            const modelingHoursPerCharacter = baseModelingTime * complexityFactor
            const texturingHoursPerCharacter = baseTexturingTime * complexityFactor
            const riggingHoursPerCharacter = baseRiggingTime * complexityFactor
            const animationHoursPerCharacter = baseAnimationTime * parameters.animationsPerCharacter * complexityFactor

            const hoursPerCharacter =
              modelingHoursPerCharacter +
              texturingHoursPerCharacter +
              riggingHoursPerCharacter +
              animationHoursPerCharacter

            updateProgress(15, "Расчет времени на персонажа...")

            setTimeout(() => {
              if (cancelled) return

              // Расчет общего времени и стоимости
              const totalHours = hoursPerCharacter * parameters.characterCount
              const hourlyRate = parameters.averageSalary / (parameters.workdaysPerMonth * parameters.hoursPerDay)
              const baseCost = totalHours * hourlyRate
              const taxCost = baseCost * (parameters.taxRate / 100)
              const contingencyCost = (baseCost + taxCost) * (parameters.contingencyReserve / 100)
              const totalCost = baseCost + taxCost + contingencyCost

              updateProgress(15, "Расчет общей стоимости...")

              setTimeout(() => {
                if (cancelled) return

                // Расчет распределения затрат
                const modelingCost = (modelingHoursPerCharacter / hoursPerCharacter) * (totalCost - contingencyCost)
                const texturingCost = (texturingHoursPerCharacter / hoursPerCharacter) * (totalCost - contingencyCost)
                const riggingCost = (riggingHoursPerCharacter / hoursPerCharacter) * (totalCost - contingencyCost)
                const animationCost = (animationHoursPerCharacter / hoursPerCharacter) * (totalCost - contingencyCost)

                // Расчет длительности проекта
                const totalWorkdays = totalHours / parameters.hoursPerDay
                const projectDuration = totalWorkdays / (parameters.workdaysPerMonth / 30)

                // Учитываем вероятность задержек
                const delayFactor = parameters.delayProbability / 100
                const delayDuration = parameters.averageDelayDuration * delayFactor
                const totalProjectDuration = projectDuration + delayDuration

                updateProgress(15, "Расчет рисков и эффективности...")

                setTimeout(() => {
                  if (cancelled) return

                  // Расчет рисков и эффективности
                  const budgetEfficiency = Math.min(100, 100 - Math.abs((totalCost / parameters.budget - 1) * 100))

                  // Риски
                  const delayRisk = Math.min(
                    100,
                    parameters.delayProbability * (1 + (totalProjectDuration / parameters.projectDuration - 1) * 0.5),
                  )

                  const budgetOverrunRisk = Math.min(
                    100,
                    (totalCost > parameters.budget ? 80 : 20) +
                      (totalCost / parameters.budget) * 20 +
                      parameters.contingencyReserve * 0.2,
                  )

                  const technicalRisk = Math.min(
                    100,
                    parameters.characterComplexity * 5 +
                      (parameters.highDetailModels ? 15 : 0) +
                      (parameters.photoRealisticTextures ? 15 : 0) +
                      (parameters.advancedPhysics ? 20 : 0),
                  )

                  const qualityRisk = Math.min(
                    100,
                    (parameters.budget < totalCost ? 70 : 30) +
                      (parameters.projectDuration < totalProjectDuration ? 20 : 0) +
                      (10 - parameters.characterComplexity) * 3,
                  )

                  // Рекомендации
                  const recommendedBudgetIncrease = totalCost > parameters.budget ? totalCost - parameters.budget : 0

                  updateProgress(15, "Формирование результатов...")

                  setTimeout(() => {
                    if (cancelled) return

                    // Формируем результаты
                    const results: CharacterCostResults = {
                      totalCost,
                      totalHours,
                      characterCount: parameters.characterCount,
                      characterComplexity: parameters.characterComplexity,
                      hoursPerCharacter,
                      projectDuration: totalProjectDuration,
                      modelingCost,
                      texturingCost,
                      riggingCost,
                      animationCost,
                      contingencyCost,
                      modelingHours: modelingHoursPerCharacter * parameters.characterCount,
                      texturingHours: texturingHoursPerCharacter * parameters.characterCount,
                      riggingHours: riggingHoursPerCharacter * parameters.characterCount,
                      animationHours: animationHoursPerCharacter * parameters.characterCount,
                      budgetEfficiency,
                      delayRisk,
                      budgetOverrunRisk,
                      technicalRisk,
                      qualityRisk,
                      recommendedBudgetIncrease,
                    }

                    updateProgress(15, "Завершение симуляции...")

                    // Сохраняем результаты в кэш
                    simulationCache.set(cacheKey, results)

                    // Ограничиваем размер кэша
                    if (simulationCache.size > 50) {
                      // Удаляем самый старый элемент
                      const firstKey = simulationCache.keys().next().value
                      simulationCache.delete(firstKey)
                    }

                    // Возвращаем результаты
                    resolve(results)
                  }, 300)
                }, 300)
              }, 300)
            }, 300)
          }, 300)
        }, 300)
      }, 300)

      // Функция для отмены симуляции
      return () => {
        cancelled = true
        reject(new Error("Симуляция отменена"))
      }
    } catch (error) {
      reject(error)
    }
  })
}
