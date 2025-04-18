import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Добавим функцию formatDate, которая используется в ReportPage.tsx
export function formatDate(dateString: string): string {
  if (!dateString) return "Неизвестная дата"

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}
