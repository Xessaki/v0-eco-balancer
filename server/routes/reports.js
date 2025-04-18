import express from "express"
import { getDb } from "../db/index.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Получение всех отчетов пользователя
router.get("/", authenticateToken, async (req, res) => {
  try {
    const db = await getDb()
    const userId = req.user.id

    console.log(`Fetching reports for user ${userId}`)

    const reports = await db.all(
      `SELECT id, title, description, simulation_type, created_at, updated_at, is_public 
       FROM reports 
       WHERE user_id = ? 
       ORDER BY updated_at DESC`,
      userId,
    )

    console.log(`Found ${reports.length} reports`)

    res.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    res.status(500).json({ error: "Failed to fetch reports" })
  }
})

// Получение отчета по ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const db = await getDb()
    const reportId = req.params.id
    const userId = req.user.id

    console.log(`Fetching report ${reportId} for user ${userId}`)

    // Получаем отчет, который принадлежит пользователю или является публичным
    const report = await db.get(
      `SELECT * FROM reports 
       WHERE id = ? AND (user_id = ? OR is_public = 1)`,
      [reportId, userId],
    )

    if (!report) {
      console.log(`Report ${reportId} not found or access denied`)
      return res.status(404).json({ error: "Report not found or access denied" })
    }

    console.log(`Report ${reportId} found, returning data`)

    // Преобразуем JSON строки обратно в объекты
    if (report.parameters) report.parameters = JSON.parse(report.parameters)
    if (report.results) report.results = JSON.parse(report.results)
    if (report.charts) report.charts = JSON.parse(report.charts)

    res.json(report)
  } catch (error) {
    console.error(`Error fetching report ${req.params.id}:`, error)
    res.status(500).json({ error: "Failed to fetch report" })
  }
})

// Создание нового отчета
router.post("/", authenticateToken, async (req, res) => {
  try {
    const db = await getDb()
    const userId = req.user.id
    const { title, description, simulationType, parameters, results, charts, isPublic = false } = req.body

    console.log(`Creating new report for user ${userId}: ${title}`)
    console.log("Report data:", {
      simulationType,
      parametersLength: parameters ? JSON.stringify(parameters).length : 0,
      resultsLength: results ? JSON.stringify(results).length : 0,
      chartsLength: charts ? JSON.stringify(charts).length : 0,
    })

    // Проверяем обязательные поля
    if (!title || !simulationType || !parameters || !results) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Преобразуем объекты в JSON строки для хранения
    const parametersJson = JSON.stringify(parameters)
    const resultsJson = JSON.stringify(results)
    const chartsJson = charts ? JSON.stringify(charts) : null

    const result = await db.run(
      `INSERT INTO reports 
       (user_id, title, description, simulation_type, parameters, results, charts, is_public) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description, simulationType, parametersJson, resultsJson, chartsJson, isPublic ? 1 : 0],
    )

    const reportId = result.lastID
    console.log(`Report created with ID: ${reportId}`)

    res.status(201).json({
      id: reportId,
      message: "Report created successfully",
    })
  } catch (error) {
    console.error("Error creating report:", error)
    res.status(500).json({ error: "Failed to create report" })
  }
})

// Обновление отчета
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const db = await getDb()
    const reportId = req.params.id
    const userId = req.user.id
    const { title, description, parameters, results, charts, isPublic } = req.body

    console.log(`Updating report ${reportId} for user ${userId}`)

    // Проверяем, существует ли отчет и принадлежит ли он пользователю
    const report = await db.get("SELECT id FROM reports WHERE id = ? AND user_id = ?", [reportId, userId])

    if (!report) {
      return res.status(404).json({ error: "Report not found or access denied" })
    }

    // Формируем запрос на обновление
    let query = "UPDATE reports SET updated_at = CURRENT_TIMESTAMP"
    const params = []

    if (title !== undefined) {
      query += ", title = ?"
      params.push(title)
    }

    if (description !== undefined) {
      query += ", description = ?"
      params.push(description)
    }

    if (parameters !== undefined) {
      query += ", parameters = ?"
      params.push(JSON.stringify(parameters))
    }

    if (results !== undefined) {
      query += ", results = ?"
      params.push(JSON.stringify(results))
    }

    if (charts !== undefined) {
      query += ", charts = ?"
      params.push(JSON.stringify(charts))
    }

    if (isPublic !== undefined) {
      query += ", is_public = ?"
      params.push(isPublic ? 1 : 0)
    }

    query += " WHERE id = ? AND user_id = ?"
    params.push(reportId, userId)

    await db.run(query, params)
    console.log(`Report ${reportId} updated successfully`)

    res.json({ message: "Report updated successfully" })
  } catch (error) {
    console.error(`Error updating report ${req.params.id}:`, error)
    res.status(500).json({ error: "Failed to update report" })
  }
})

// Удаление отчета
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const db = await getDb()
    const reportId = req.params.id
    const userId = req.user.id

    console.log(`Deleting report ${reportId} for user ${userId}`)

    // Удаляем отчет, если он принадлежит пользователю
    const result = await db.run("DELETE FROM reports WHERE id = ? AND user_id = ?", [reportId, userId])

    if (result.changes === 0) {
      return res.status(404).json({ error: "Report not found or access denied" })
    }

    console.log(`Report ${reportId} deleted successfully`)

    res.json({ message: "Report deleted successfully" })
  } catch (error) {
    console.error(`Error deleting report ${req.params.id}:`, error)
    res.status(500).json({ error: "Failed to delete report" })
  }
})

export default router
