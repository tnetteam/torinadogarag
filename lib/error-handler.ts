// Error handling utilities and custom error classes

export interface ErrorInfo {
  message: string
  code?: string
  statusCode?: number
  details?: unknown
  timestamp: string
  stack?: string
}

export class AppError extends Error {
  public code: string
  public statusCode: number
  public details: unknown
  public timestamp: string

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details: unknown = null
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, 'CONFLICT', details)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT')
    this.name = 'RateLimitError'
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(`External service error (${service}): ${message}`, 502, 'EXTERNAL_SERVICE_ERROR')
    this.name = 'ExternalServiceError'
  }
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: ErrorInfo[] = []
  private maxLogSize = 1000

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Log error
  public logError(error: Error | AppError, context?: unknown): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
      statusCode: error instanceof AppError ? error.statusCode : 500,
      details: error instanceof AppError ? error.details : null,
      timestamp: new Date().toISOString(),
      stack: error.stack
    }

    // Add context if provided
    if (context) {
      errorInfo.details = { 
        ...(errorInfo.details && typeof errorInfo.details === 'object' ? errorInfo.details : {}), 
        context 
      }
    }

    // Add to log
    this.errorLog.push(errorInfo)

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo)
    }

    // In production, you might want to send to external logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogger(errorInfo)
    }
  }

  // Get error logs
  public getErrorLogs(limit?: number): ErrorInfo[] {
    return limit ? this.errorLog.slice(-limit) : this.errorLog
  }

  // Clear error logs
  public clearErrorLogs(): void {
    this.errorLog = []
  }

  // Get error statistics
  public getErrorStats(): {
    total: number
    byCode: Record<string, number>
    byStatusCode: Record<number, number>
    recent: ErrorInfo[]
  } {
    const byCode: Record<string, number> = {}
    const byStatusCode: Record<number, number> = {}
    const recent = this.errorLog.slice(-10)

    this.errorLog.forEach(error => {
      byCode[error.code || 'UNKNOWN'] = (byCode[error.code || 'UNKNOWN'] || 0) + 1
      byStatusCode[error.statusCode || 500] = (byStatusCode[error.statusCode || 500] || 0) + 1
    })

    return {
      total: this.errorLog.length,
      byCode,
      byStatusCode,
      recent
    }
  }

  // Send to external logger (implement based on your logging service)
  private sendToExternalLogger(errorInfo: ErrorInfo): void {
    // Example: Send to Sentry, LogRocket, or other logging service
    // This is a placeholder implementation
    console.log('Sending to external logger:', errorInfo)
  }
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance()

// API error handler
export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error && typeof error === 'object' && 'response' in error) {
    // HTTP error response
    const response = (error as { response: { status: number; data?: { message?: string; details?: unknown } } }).response
    const status = response.status
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? (error as { message: string }).message 
      : 'خطای HTTP'
    const message = response.data?.message || errorMessage

    switch (status) {
      case 400:
        return new ValidationError(message, response.data?.details)
      case 401:
        return new UnauthorizedError(message)
      case 403:
        return new ForbiddenError(message)
      case 404:
        return new NotFoundError(message)
      case 409:
        return new ConflictError(message)
      case 429:
        return new RateLimitError(message)
      default:
        return new AppError(message, status, 'HTTP_ERROR')
    }
  }

  if (error && typeof error === 'object' && 'request' in error) {
    // Network error
    return new AppError('خطا در ارتباط با سرور', 503, 'NETWORK_ERROR')
  }

  // Unknown error
  const errorMessage = error && typeof error === 'object' && 'message' in error 
    ? (error as { message: string }).message 
    : 'خطای غیرمنتظره'
  return new AppError(errorMessage, 500, 'UNKNOWN_ERROR')
}

// Error message translations
export const errorMessages = {
  VALIDATION_ERROR: 'اطلاعات وارد شده صحیح نیست',
  NOT_FOUND: 'منبع مورد نظر یافت نشد',
  UNAUTHORIZED: 'دسترسی غیرمجاز',
  FORBIDDEN: 'دسترسی ممنوع',
  CONFLICT: 'تداخل در اطلاعات',
  RATE_LIMIT: 'تعداد درخواست‌ها بیش از حد مجاز است',
  EXTERNAL_SERVICE_ERROR: 'خطا در سرویس خارجی',
  NETWORK_ERROR: 'خطا در ارتباط با سرور',
  UNKNOWN_ERROR: 'خطای غیرمنتظره رخ داد'
}

// Get user-friendly error message
export function getErrorMessage(error: AppError): string {
  return errorMessages[error.code as keyof typeof errorMessages] || error.message
}