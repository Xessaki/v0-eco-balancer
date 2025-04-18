"use client"

import type React from "react"

// Simplified version of use-toast
import { useState } from "react"

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export type ToasterToast = Toast & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

export type ToastActionElement = React.ReactElement

export const useToast = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const toast = ({ ...props }: Toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...props, id }

    setToasts((prevToasts) => {
      const updatedToasts = [...prevToasts, newToast].slice(-TOAST_LIMIT)

      setTimeout(() => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
      }, TOAST_REMOVE_DELAY)

      return updatedToasts
    })

    return {
      id,
      dismiss: () => setToasts((toasts) => toasts.filter((t) => t.id !== id)),
      update: (props: Toast) => setToasts((toasts) => toasts.map((t) => (t.id === id ? { ...t, ...props } : t))),
    }
  }

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => {
      if (toastId) {
        setToasts((toasts) => toasts.filter((t) => t.id !== toastId))
      } else {
        setToasts([])
      }
    },
  }
}
