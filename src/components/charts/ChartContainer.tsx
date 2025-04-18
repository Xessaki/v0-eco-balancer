"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { Button } from "../ui/button"
import { Download, Maximize2, Minimize2 } from "lucide-react"

interface ChartContainerProps {
  title?: string
  description?: string
  children: React.ReactNode | React.ReactNode[]
  tabs?: string[]
  defaultTab?: string
  allowFullscreen?: boolean
  allowDownload?: boolean
  downloadData?: any
  downloadFilename?: string
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  tabs,
  defaultTab,
  allowFullscreen = true,
  allowDownload = false,
  downloadData,
  downloadFilename = "chart-data.json",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const childrenArray = Array.isArray(children) ? children : [children]

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Ошибка при переходе в полноэкранный режим: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleDownload = () => {
    if (!downloadData) return

    const dataStr = JSON.stringify(downloadData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = downloadFilename
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg shadow-lg border border-gray-700 ${isFullscreen ? "fixed inset-0 z-50 p-4 overflow-auto" : ""}`}
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div>
          {title && <h2 className="text-xl font-semibold text-gray-200">{title}</h2>}
          {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
        </div>

        <div className="flex space-x-2">
          {allowDownload && downloadData && (
            <Button variant="outline" size="sm" onClick={handleDownload} className="text-gray-300 hover:text-white">
              <Download size={16} className="mr-1" />
              <span className="hidden sm:inline">Скачать данные</span>
            </Button>
          )}

          {allowFullscreen && (
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="text-gray-300 hover:text-white">
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        {tabs && tabs.length > 0 ? (
          <Tabs defaultValue={defaultTab || tabs[0]}>
            <TabsList className="mb-4">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab, index) => (
              <TabsContent key={tab} value={tab}>
                {childrenArray[index] || childrenArray[0]}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default ChartContainer
