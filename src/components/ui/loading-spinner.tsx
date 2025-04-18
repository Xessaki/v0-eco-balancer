import type React from "react"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
  message?: string
  fullScreen?: boolean
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  message = "Загрузка...",
  fullScreen = false,
  className = "",
}) => {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-t-green-500 dark:border-t-green-400 border-gray-200 dark:border-gray-700 rounded-full animate-spin`}
      ></div>
      {message && <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

export default LoadingSpinner
