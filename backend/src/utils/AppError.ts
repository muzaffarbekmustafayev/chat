export class AppError extends Error {
  public statusCode: number
  public status: 'fail' | 'error'
  public code: string
  public isOperational: boolean

  constructor(message: string, statusCode: number, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'
    this.code = code || this.defaultCode(statusCode)
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }

  private defaultCode(code: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_ERROR',
    }
    return map[code] || 'ERROR'
  }
}
