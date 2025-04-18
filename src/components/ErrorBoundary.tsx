import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Обновляем состояние, чтобы при следующем рендере показать запасной UI
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Можно также отправить отчет об ошибке в сервис аналитики
    console.error("Ошибка в компоненте:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Если произошла ошибка, показываем запасной UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Что-то пошло не так</h2>
          <p className="text-red-600 mb-4">
            Произошла ошибка при отображении этого компонента. Пожалуйста, попробуйте обновить страницу.
          </p>
          <details className="bg-white p-3 rounded-md">
            <summary className="cursor-pointer text-gray-700 font-medium">Техническая информация</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}
