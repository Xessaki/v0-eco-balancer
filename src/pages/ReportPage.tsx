"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getReport } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils"

interface ChartData {
  title: string
  image: string
}

interface ReportData {
  id: number
  title: string
  description: string
  simulation_type: string
  parameters: Record<string, any>
  results: Record<string, any>
  charts?: Record<string, ChartData>
  created_at: string
  updated_at: string
  is_public: boolean
}

export default function ReportPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        console.error("No reportId provided")
        setError("Идентификатор отчета не указан")
        setLoading(false)
        return
      }

      try {
        console.log(`Fetching report with ID: ${reportId}`)
        const data = await getReport(reportId)
        console.log("Report data received:", data)
        setReport(data)
      } catch (err) {
        console.error("Error fetching report:", err)
        setError("Не удалось загрузить отчет")

        // Временно отключаем автоматическое перенаправление при ошибке
        // toast({
        //   title: 'Ошибка',
        //   description: 'Не удалось загрузить отчет',
        //   variant: 'destructive'
        // });
        // navigate('/');
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [reportId, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Ошибка</CardTitle>
            <CardDescription>{error || "Отчет не найден"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p>Детали ошибки:</p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                {JSON.stringify({ error, reportId }, null, 2)}
              </pre>
              <Button onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на главную
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>Тип симуляции: {report.simulation_type}</CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Создан: {formatDate(report.created_at)}
              {report.updated_at !== report.created_at && <div>Обновлен: {formatDate(report.updated_at)}</div>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {report.description && (
            <div className="mb-4">
              <h3 className="text-lg font-medium">Описание</h3>
              <p className="text-gray-700">{report.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Параметры симуляции</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(report.parameters, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Результаты симуляции</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(report.results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      {report.charts && Object.keys(report.charts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Графики</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(report.charts).map(([chartId, chartData]) => (
                <div key={chartId} className="flex flex-col">
                  <h3 className="text-lg font-medium mb-2">{chartData.title}</h3>
                  <div className="border rounded-md overflow-hidden">
                    <img src={chartData.image || "/placeholder.svg"} alt={chartData.title} className="w-full h-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
